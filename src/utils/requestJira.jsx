import { fetch } from '@forge/api';
import base64 from 'base-64';

const fetchOptions = () => {
    const authToken = base64.encode(`${process.env.username}:${process.env.token}`);
    return {
    method: "GET",
    headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json"
    }
}};

const postOptions = (body) => {
    const authToken = base64.encode(`${process.env.username}:${process.env.token}`);
    return {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json"
    }
}};

export const requestJira = async (url) => await fetch(`${process.env.baseUrl}${url}`, fetchOptions());

export const postJira = async (url, body) => await fetch(`${process.env.baseUrl}${url}`, postOptions(body));
