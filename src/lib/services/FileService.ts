// lib/services/FileService.ts
export class FileService {
    static async createTempFiles(contents: string[]): Promise<string[]> {
        const tempDirPath = await Deno.makeTempDir({
            prefix: "pem_bundler-",
            dir: '/tmp'
        });

        return Promise.all(
            contents.map(async (content) => {
                const tempFilePath = await Deno.makeTempFile({
                    prefix: `pem_bundler-`,
                    suffix: ".pem",
                    dir: tempDirPath
                });
                await Deno.writeTextFile(tempFilePath, content);
                return tempFilePath;
            })
        );
    }
    
    static async cleanup(paths: string[]): Promise<void> {
        await Promise.all(paths.map(path => Deno.remove(path).catch(() => {})));
    }
}
