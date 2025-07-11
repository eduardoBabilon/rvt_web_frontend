import { Params } from '@/service/types';
import { stringify } from 'qs';

export function replaceParams(url: string, params: Params) {
  const urlWithParams = Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replaceAll(`:${key}`, value !== null && value !== undefined ? value.toString() : '');
  }, url);
  return urlWithParams;
}

export function mountUrl(url: string, baseUrl: string, params?: Params, query?: (Params | undefined)[]) {
  const urlApi = baseUrl;
  const urlWithParams = params ? replaceParams(url, params) : url;
  let queryString = '';

  if (query)
  if(query!.length > 0){
    query!.forEach(param => {
      let formatedParam = JSON.parse(JSON.stringify(param))
      let paramName = Object.keys(formatedParam)[0]
      let paramValue = formatedParam[paramName]
      let url = ''
      if(Array.isArray(paramValue) && paramValue.length > 0){
        paramValue.map((item, index)=>{
          url = url + paramName + '=' + item + (index + 1 < paramValue.length ?  "&" : "")
        })
      }else{
        url = paramName + '=' + encodeURIComponent(String(paramValue))
      }
      queryString = queryString + (queryString !== "" ? "&" : "?" ) + url
    });

  }

  const completedUrl = urlApi + urlWithParams + queryString;

  return completedUrl;
}
