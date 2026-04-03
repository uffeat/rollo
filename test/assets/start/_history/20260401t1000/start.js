const { frame } = await use("@/frame/");

const main = document.getElementById('main')
main.append(frame)


const user = await use("@@/login/");
console.log('user:', user)