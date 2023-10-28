export const RE_DIGIT = new RegExp(/^\d+$/);

export const setToken = async (data) => {
    try {
        const accessToken = data.accessToken;
        console.log(accessToken, 'token')
        localStorage.setItem("accessToken", accessToken);
    } catch (error) {
        console.log("Could not set accessToken ", error.message);
    }
}


export const shortenXterLength = (string, number = 10) => {
    if (string) {
        if (string.length <= number) {
            return string
        }
        return `${string.slice(0, number)}..`
    }
    return ''
}
