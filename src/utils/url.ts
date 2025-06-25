export const addSlash = (url: string): string => url.at(0) === '/' ? url : `/${url}`;
