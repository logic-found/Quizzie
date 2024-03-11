export const useCustomHook = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('hy')
            resolve()
        }, 1000)
    })
}