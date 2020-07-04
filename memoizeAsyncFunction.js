// Reference:
// https://medium.com/@bluepnume/async-javascript-is-much-more-fun-when-you-spend-less-time-thinking-about-control-flow-8580ce9f73fc
function memoize(method) {
    let cache = {};

    return async function() {
        console.log('===========================');
        console.log('method.name: ', method.name);
        console.log('arguments: ', arguments);
        console.log('this: ', this);
        console.log('===========================');
        let args = JSON.stringify(arguments);
        cache[args] = cache[args] || method.apply(this, arguments);
        console.log('cache: ', cache);
        console.log('===========================');
        return cache[args];
    };
}

let getSoupRecipe = memoize(async function recipe(soupType) {
    console.log('===========================');
    console.log('start Get Soup Recipe by soupType: ', soupType);
    const recipe = await new Promise(resolve => setTimeout(resolve, 3000, 'Recipe'));
    console.log('GOT recipe: ', recipe);
    console.log('===========================');
    return recipe;
});

let buySoupPan = memoize(async function pan() {
    console.log('===========================');
    console.log('start Buy soup pan');
    const pan = await new Promise(resolve => setTimeout(resolve, 5000, 'Pan'));
    console.log('GOT pan: ', pan);
    console.log('===========================');
    return pan;
});

let hireSoupChef = memoize(async function chef(soupType) {
    console.log('===========================');
    console.log('start Hire Chef by soupType: ', soupType);
    let soupRecipe = await getSoupRecipe(soupType);
    console.log('recipe to hire Chef: ', soupRecipe);

    const chef = await new Promise(resolve => setTimeout(resolve, 10000, 'Chef'));
    console.log('GOT chef: ', chef);
    console.log('===========================');
    return chef;
});

let makeSoup = memoize(async function make(soupType) {
    console.log('===========================');
    console.log('start Make Soup by soupType: ', soupType);

    let [soupRecipe, soupPan, soupChef] = await Promise.all([
        getSoupRecipe(soupType), buySoupPan(), hireSoupChef(soupType),
    ]);

    console.log('GOT soupRecipe: ', soupRecipe);
    console.log('GOT soupPan: ', soupPan);
    console.log('GOT soupChef: ', soupChef);

    const soupDone = await new Promise(resolve => setTimeout(resolve, 15000, 'Soup DONE'));
    console.log('soupDone: ', soupDone);
    console.log('===========================');
    return soupDone;
});

makeSoup('TYPE ABC').then(result => {
    console.log('result: ', result);
});
