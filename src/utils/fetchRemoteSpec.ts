import axios from 'axios';
import { ERROR_MESSAGES } from '../constants';

function getFileTypeByContentType(contentType: string) {
  if (contentType.includes('json')) {
    return 'json';
  }

  if (contentType.includes('yaml') || contentType.includes('yml')) {
    return 'yaml';
  }

  return '';
}

export function fetchRemoteSpec(url: string, timeout: number = 180000) {
  const instance = axios.create({ timeout });

  return instance
    .get(url)
    .then((response) => {
      return {
        data: response.data,
        fileType: getFileTypeByContentType(response.headers['content-type'])
      };
    })
    .catch((error) => {
      console.error(
        `${error.code}: ${ERROR_MESSAGES.FETCH_CLIENT_FAILED_ERROR}`
      );
    });
}