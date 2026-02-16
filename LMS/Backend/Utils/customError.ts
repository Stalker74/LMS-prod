export const customError = (statusCode:number, message:string)=>{
    const error:any = new Error()
    error.message = message || 'Soemthing went wrong'
    error.statusCode = statusCode || 500
    return error
}