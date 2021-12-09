require('../db/index')

const Subscription = require('../models/Subscription.model')
const Product = require('../models/Product.model')

const title = "Lorem ipsum dolor"
const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, id?"
const total = 0
const images = [
    'https://www.eatthis.com/wp-content/uploads/sites/4/2020/05/snacks-in-america.jpg',
    'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F12%2F2015%2F04%2Fgettyimages-549971471-2000.jpg',
    'https://cdn.vox-cdn.com/thumbor/417IwSaeA3q7G6RSI001V7z3z4g=/0x25:2000x1525/1200x675/filters:focal(0x25:2000x1525)/cdn.vox-cdn.com/uploads/chorus_image/image/45800082/snacksofourlives.0.0.jpg',
    'https://www.bruker.com/en/applications/food-analysis-and-agriculture/food-quality/snacks/_jcr_content/root/herostage/backgroundImageVPL.coreimg.82.1920.jpeg/1597679208099/savoury-snacks.jpeg',
    'https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/x17/2018_sweet-sallty-snack-mix_5817_760x580.jpg?ext=.jpg',
    'https://insanelygoodrecipes.com/wp-content/uploads/2021/08/Sweet-and-Salty-Snacks-Cookies-Peanuts-Tacos-Pretzels-and-Chocolate-Bars.jpg',
    'https://www.tasteofhome.com/wp-content/uploads/2019/05/shutterstock_273975992.jpg?fit=700,700',
    ]

async function createSubscriptions(amount) {
    const products = await Product.find()

    for(let i = 0; i < amount; i++) {
        const image = images[Math.floor(Math.random() * images.length)]
        const range = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 20)]

        const newSubscription = {
            title,
            description,
            image,
            total,
            products: products.splice(range[0], range[1]).map(p => p._id)
        }
        console.log(newSubscription)
        Subscription.create(newSubscription)
    }
}

createSubscriptions(20)

async function populateTest() {
    const subs = await Subscription.find().populate('products')

    console.log(subs[0])
}

//populateTest()