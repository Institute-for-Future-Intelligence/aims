/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

export class Util {

    static isOpenFromURL() {
        const params = new URLSearchParams(window.location.search);
        const userid = params.get('userid');
        const title = params.get('title');
        const project = params.get('project');
        return !!(userid && title && !project);
    }

}
