// Reference:
// https://medium.com/@bluepnume/even-with-async-await-you-probably-still-need-promises-9b259854c161
// https://docs.aws.amazon.com/general/latest/gr/api-retries.html
function ajax(endpoint) {
    return new Promise((resolve, reject) => {
        if (endpoint === 1) {
            setTimeout(resolve, 1000, {
                state: 'logged_out',
            });
        } else if (endpoint === 2) {
            setTimeout(resolve, 1000, {
                state: 'logged_in',
            });
        } else {
            reject('STOP');
        }
    });
}

function retry(id, delay) {
    new Promise(resolve => {
        setTimeout(resolve, delay);
    }).then(() => {
        console.log('run retry: ');
        return onUserLoggedIn(id + 1);
    });
}

function onUserLoggedIn(id) {
    ajax(id)
        .then(user => {
            console.log('user: ', user);
            if (user.state !== 'logged_in') {
                retry(id, 2 * 1000);
            } else {
                return user;
            }
        })
        .then(result => console.log('result: ', result))
        .catch(error => {
            console.log('error: ', error);
        });
}

onUserLoggedIn(1);
