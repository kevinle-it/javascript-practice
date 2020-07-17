const post = {
    getComments: function() {
        comments.id = this.id;
        return new Promise(resolve => {
            setTimeout(
                resolve,
                2000,
                comments
            );
        });
    },
};
const comments = {
    noOfComments: 10,
    getFirstComment: function() {
        return new Promise(resolve => {
            setTimeout(
                resolve,
                3000,
                `1st comment of Post No. ${this.id}`
            );
        });
    },
};
// Simulate the co library to use generator power for doing asynchronous operations
// https://www.npmjs.com/package/co
function co(generator) {
    this.generator = generator();   // Returns a generator
    this.generator
        .next() // log('Start Generator'), then run to findByID(1), and pause there
                // 'post' variable is still undefined now
        .value  // returns Promise inside findByID(1)
        .then(response => {
            console.log('response 1: ', response);
            // We now have response of findByID(1)
            // 'post' variable is still undefined now
            // Call processNext with 'this' function's context
            processNext.call(this, response);
        });
}

function processNext(response) {
    // Reference on Generator as Observer:
    // https://exploringjs.com/es6/ch_generators.html#sec_generators-as-observers
    // 1st call of this.generator.next(response)
    // => Pass current 'response' to 'post' variable, then run post.getComments(), and pause there
    // 2nd call of this.generator.next(response)
    // => Pass current 'response' to 'comments' variable, then run comments.getFirstComments(), and pause there
    // 3rd call of this.generator.next(response)
    // => Pass current 'response' to 'firstComment' variable,
    // Now next = { value: undefined, done: true }, run to function end => log(post, comments, firstComment)
    const next = this.generator.next(response); // this.generator of above co function's context
    // next = { value: Promise, done: false | true }
    if (next.done === false) {  // done === true on the 3rd this.generator.next(response) call (3 yields here only)
        const promise = next.value;
        if (promise !== undefined) {
            promise.then(response => {
                console.log('response: ', response);
                processNext(response);  // Call processNext recursively
            });
        }
    }
}

function findByID(id) {
    post.id = id;
    return new Promise(resolve => {
        setTimeout(resolve, 1000, post);
    });
}

co(function* () {
    console.log('Start Generator');
    let post = yield findByID(1);
    let comments = yield post.getComments();
    let firstComment = yield comments.getFirstComment();
    console.log(post, comments, firstComment);
});
