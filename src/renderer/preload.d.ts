// https://stackoverflow.com/questions/73117495/how-to-import-other-types-from-ts-file-in-d-ts-file
interface Window {
    helium: import('common/types').HeliumGlobal
}
