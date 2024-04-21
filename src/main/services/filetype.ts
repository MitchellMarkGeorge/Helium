import { FileType } from "common/types";
import path from "path";

// const fileNameMap = {
//     '.eslint'
// }

function detectTextFile(filePath: string) {}
function detectImageFile(filePath: string) {}

function detectFileTypeFromName(fileName: string) {}




function detect(filePath: string): FileType {
    // should I just accept the file name as well?
    const fileName = path.basename(filePath);


    
    return FileType.PLAIN_TEXT;
}