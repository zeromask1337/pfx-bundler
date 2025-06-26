type Props = {
    key: string,
    certificate: string
}

type Output = Props & {
    directory: string
}

export class FileService {
    static async createTempFiles(contents: Props): Promise<Output> {
        const result = {}

        const tempDirPath = await Deno.makeTempDir({
            prefix: "pem_bundler-",
            dir: '/tmp'
        });

        for (const [key, content] of Object.entries(contents)) {
            const tempFilePath = await Deno.makeTempFile({
                prefix: `pem_bundler-${key}`,
                suffix: ".pem",
                dir: tempDirPath
            });
            await Deno.writeTextFile(tempFilePath, content);
            result[key] = tempFilePath
        }

        return {...result, directory: tempDirPath}
    }
    
    
    static async cleanup(dirPath: string): Promise<void> {
        await Deno.remove(dirPath, {recursive: true}).catch((err: unknown) => console.log("Couldn't delete temp directory: ", err))
    }
}
