import { sileo } from "sileo";

const DURATION = 2500;

export const toast = {
    success: (title) =>
        sileo.success({ title, duration: DURATION, position: "top-center" }),

    error: (title) =>
        sileo.error({ title, duration: DURATION, position: "top-center" }),

    warning: (title) =>
        sileo.warning({ title, duration: DURATION, position: "top-center" }),

    info: (title) =>
        sileo.info({ title, duration: DURATION, position: "top-center" }),

    promise: (promise, { loading, success, error }) =>
        sileo.promise(promise, {
            loading: { title: loading },
            success: { title: success },
            error: { title: error },
        }),
};