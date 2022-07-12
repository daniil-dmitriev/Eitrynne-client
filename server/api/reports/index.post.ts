import {defineEventHandler, useBody, useCookie} from "h3";
import {useRuntimeConfig} from "#imports";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await useBody(event);

    // format dates
    let recordDate = body.dates.begin;
    let dateArray = recordDate.split(".");
    [dateArray[0], dateArray[1], dateArray[2]] = [dateArray[2], dateArray[1], dateArray[0]];
    const begin = dateArray.join(".");

    recordDate = body.dates.end;
    dateArray = recordDate.split(".");
    [dateArray[0], dateArray[1], dateArray[2]] = [dateArray[2], dateArray[1], dateArray[0]];
    const end = dateArray.join(".");


    return await $fetch(`${config.API_BASE_URL}/reports/${body.type}`, {
        method: "post",
        body: {
            ...body,
             dates: {
                begin,
                 end
             }
        },
        headers: {
            authorization: `Bearer ${useCookies(event).token}`
        }
    });
})
