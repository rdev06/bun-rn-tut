export default function isLoggedIn(){
    const token = localStorage.getItem('authToken');
    return !!token;
}