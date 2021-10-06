export const signIn = () => {
    return new Promise(resolve=> {
        setTimeout(()=>{
            resolve({
                token: 'ijbcbvpornvuyewbvpoiewbgveiwonvpowjbvweivnw9bvn340bv3943in9',
                user:{
                    name: 'NewUser',
                    email: 'myemail@email.com'
                }
            })
        }, 2000)
    })
}