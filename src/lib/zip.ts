// Minimaler ZIP-Schreiber ohne Abhängigkeiten (Methode "Store", keine Kompression,
// Bilder sind ohnehin schon komprimiert). Streamt Datei für Datei, damit auch
// grosse Backups auf dem Shared-Hosting nicht komplett im RAM liegen müssen.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date): { time: number; date: number } {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}

export type ZipEntry = { name: string; read: () => Promise<Buffer>; mtime?: Date };

// Liefert einen Web-ReadableStream mit dem fertigen ZIP.
export function zipStream(entries: ZipEntry[]): ReadableStream<Uint8Array> {
  const central: Buffer[] = [];
  let offset = 0;
  let i = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i < entries.length) {
        const e = entries[i++];
        const data = await e.read();
        const name = Buffer.from(e.name, "utf8");
        const crc = crc32(data);
        const { time, date } = dosDateTime(e.mtime ?? new Date());

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4); // Version
        local.writeUInt16LE(0x0800, 6); // UTF-8-Dateinamen
        local.writeUInt16LE(0, 8); // Store
        local.writeUInt16LE(time, 10);
        local.writeUInt16LE(date, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);
        local.writeUInt16LE(0, 28);

        const cd = Buffer.alloc(46);
        cd.writeUInt32LE(0x02014b50, 0);
        cd.writeUInt16LE(20, 4);
        cd.writeUInt16LE(20, 6);
        cd.writeUInt16LE(0x0800, 8);
        cd.writeUInt16LE(0, 10);
        cd.writeUInt16LE(time, 12);
        cd.writeUInt16LE(date, 14);
        cd.writeUInt32LE(crc, 16);
        cd.writeUInt32LE(data.length, 20);
        cd.writeUInt32LE(data.length, 24);
        cd.writeUInt16LE(name.length, 28);
        cd.writeUInt16LE(0, 30);
        cd.writeUInt16LE(0, 32);
        cd.writeUInt16LE(0, 34);
        cd.writeUInt16LE(0, 36);
        cd.writeUInt32LE(0, 38);
        cd.writeUInt32LE(offset, 42);
        central.push(Buffer.concat([cd, name]));

        const chunk = Buffer.concat([local, name, data]);
        offset += chunk.length;
        controller.enqueue(new Uint8Array(chunk));
        return;
      }

      const cdBuf = Buffer.concat(central);
      const end = Buffer.alloc(22);
      end.writeUInt32LE(0x06054b50, 0);
      end.writeUInt16LE(0, 4);
      end.writeUInt16LE(0, 6);
      end.writeUInt16LE(central.length, 8);
      end.writeUInt16LE(central.length, 10);
      end.writeUInt32LE(cdBuf.length, 12);
      end.writeUInt32LE(offset, 16);
      end.writeUInt16LE(0, 20);
      controller.enqueue(new Uint8Array(Buffer.concat([cdBuf, end])));
      controller.close();
    },
  });
}
