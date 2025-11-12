if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

export function getUsers() {
    return JSON.parse(localStorage.getItem('users'));
}

export function addUser(name, email, password) {
    const users = getUsers();
    
  
    if (users.find(user => user.email === email)) {
        throw new Error('Email này đã được đăng ký!');
    }

    users.push({
        id: Date.now().toString(), 
        name,
        email,
        password 
    });

    localStorage.setItem('users', JSON.stringify(users));
}

export function checkLogin(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng!');
    }

    return user;
}