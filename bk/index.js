const data = {user:[], todo:[]};


function parseToken(token){
    if(!token.startsWith('bk_')) throw 'Invalid Token';
    return token.slice(3);
}

const handler = {
    user:{
        GET: req => {
            if(req.auth?.userId){
                return data.user[req.auth.userId]||null
            }
            return data.user;
        },
        POST: req => {
            data.user.push(req.data)
            return {message: 'Added!'}
        },
        PUT: req => {
            if(!req.auth.userId) throw new Error('Please login');
            data.user[req.auth.userId] = req.data;
            return {message: 'Updated!'}
        },
        login: {
            POST: req => {
                let user = null;
                let userId = null;
                for (let i = 0; i < data.user.length; i++) {
                    const u = data.user[i];
                    if(u.email === req.data.email){
                        user = u;
                        userId = i;
                        break;
                    }
                    
                }
                if(!user) throw {message: 'User Not Found'};
                if(user.password !== req.data.password) throw {message: 'Incorrect password'}
                return {token: 'bk_' + userId};
            }
        }
    },
    todo:{
        POST: req => {
            if(!req.auth.userId) throw new Error('Please login');
            data.todo.push({...req.data, userId: req.auth.userId})
        },
        PUT: req => {
            if(!req.auth.userId) throw new Error('Please login');
            if(!req.id) throw new Error('Todo Id is required');
            data.todo[req.id] = {...req.data, userId: req.auth.userId}
            return {message: 'Updated!'}
        },
        DELETE: req => {
            if(!req.auth.userId) throw new Error('Please login');
            if(!req.id) throw new Error('Todo Id is required');
            data.todo.splice(req.id, 1);
            return {message: 'Deleted!'}
        }
    }
}


const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, PUT, DELETE, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
}


const server = Bun.serve({
    port: 5000,
    async fetch(req){
        if (req.method === 'OPTIONS') {
            return Response('Departed', {headers: CORS_HEADERS});
        }
        const url = new URL(req.url);
        const radix = url.pathname.split('/');
        const NOT_FOUND = `Path ${url.pathname} with method ${req.method} does not exist`;
        radix.shift();
        const lastElement = radix.at(-1)
        if(parseInt(lastElement).toString().length === lastElement.length || lastElement === '0'){
            req.id = lastElement;
            radix.pop();
        }
        let toCompute = handler;
        try {
            for (const p of radix) {
                toCompute = toCompute[p]
            }
            toCompute = toCompute[req.method];
        } catch (error) {
            throw new Error(NOT_FOUND)
        }

        if(!toCompute) throw new Error(NOT_FOUND)

        if(req.body){
            req.data = await Bun.readableStreamToJSON(req.body);
        }
        if(req.headers.get('authorization')){
            const [_, token] = req.headers.get('authorization').split(' ');
            if(token){
                req.auth = {userId: parseToken(token)}
            }
        }
        return Response.json(toCompute(req), {headers: CORS_HEADERS})
    },
    error(err){
        return Response.json(err, {status: 404, headers: CORS_HEADERS})
    }
})



console.log(`server is running on http://localhost:${server.port}`)