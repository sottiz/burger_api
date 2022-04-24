import * as crypto from "crypto";

export class SecurityUtils {

    public static sha256(str: string): string {
        const hash = crypto.createHash("sha256");
        hash.update(str);
        return hash.digest("hex");
    }
}
