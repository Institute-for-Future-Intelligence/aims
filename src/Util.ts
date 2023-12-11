/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import platform from 'platform';

export class Util {

    static isOpenFromURL() {
        const params = new URLSearchParams(window.location.search);
        const userid = params.get('userid');
        const title = params.get('title');
        const project = params.get('project');
        return !!(userid && title && !project);
    }

    static getOS(): string | undefined {
        return platform.os?.family;
    }

    static isMac(): boolean {
        const os = Util.getOS();
        if (os) return os.includes('Mac') || os.includes('OS X');
        return false;
    }

    static isChrome(): boolean {
        const os = Util.getOS();
        if (os) return os.includes('Chrome');
        return false;
    }

}
