console.log("Etsy")

// Models 
var HomeModel = Backbone.Model.extend({
	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
	url: 'https://openapi.etsy.com/v2/listings/active.js?limit=250&offset=250&api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
})
var DetailModel = Backbone.Model.extend({
	generateUrl: function(id) {
		this.url = 'https://openapi.etsy.com/v2/listings/'+ id +'.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
		//'https://openapi.etsy.com/v2/listings/' + id + '.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
	} 
})
var SearchModel = Backbone.Model.extend({
	generateUrl: function(searchInput) {
		this.url = "https://openapi.etsy.com/v2/listings/active.js?limit=250&offset=250&api_key=aavnvygu0h5r52qes74x9zvo&keywords=" + searchInput + "&callback=?&includes=Images"
	}
})
var UserModel = Backbone.Model.extend({
	generateUrl: function(shop_id) {
		this.url = 'https://openapi.etsy.com/v2/shops/' + shop_id + '/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images' 
		console.log(this.url)
	}
})
// Views 
var HomeView = Backbone.View.extend({
	el: ".mainContainer",
	startLoad: 0,
	changeStartNum: function() {
		this.startLoad += 8
		if (this.startLoad > 100) {
			this.startLoad = 0
		}
		this.render() 
	},
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	hmtlString: '',
	render: function() {
		var startIndex = this.startLoad
		var dataObject = this.model.get('results')
		console.log(dataObject.length)
		//console.log(dataObject)
		for (var i = startIndex; i < startIndex + 8; i++) {
			//var imagesArray = dataObject[i].Images
			//console.log(imagesArray)
			this.hmtlString +=
						'<div class="etsyItem">' + '<img class"imageItem" id="'+ dataObject[i].listing_id +'" src="' + dataObject[i].Images[0].url_170x135 + '">' +
						'<p class="description">' + dataObject[i].description.substring(0,30) + '</p>' +
						'<p class="title">' + dataObject[i].title.substring(0,12) + '</p>' +
						'<span class="price">' + dataObject[i].price + '     ' + dataObject[i].currency_code + '</span>' +
						'</div>' 
		}
		this.el.innerHTML =  '<input class="sortOptions" value="under25" type="checkbox">Under $25' + 
						'<input class="sortOptions" value="has3pictures" type="checkbox">Has 3 images or more' +
						'<h2 class="pageIntroText">Discover Items you can\'t find anywhere else</h2>' +
						this.hmtlString +
						'<div class="loadMore">\
						<p>Load more</p>\
						</div>'
	},
	events: {
		"click img": "changeView",
		"click .loadMore": "changeStartNum",
		'click [type="checkbox"]': "sortView"
	},
	changeView: function(clickEvent) {
		var listingId = clickEvent.target.id
		//console.log(listingId)
		location.hash = "detail/" + listingId 
	},
	sortView: function(e) {
		if (e.target.value === "under25") {
			location.hash = "under25" 
		}
		if (e.target.value === "has3pictures") {
			location.hash = "has3images"
		}
	}
})
var DetailView = Backbone.View.extend ({
	el: ".mainContainer",
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	render: function(data) {
		// var pageHeading = document.querySelector('.pageIntroText')
		// pageHeading.innerHTML = ''
		var imageObject = data.attributes.results[0]
		console.log(imageObject)
		var imagesOfObject = imageObject.Images[0] 
		//console.log(imagesOfObject)
		var hmtlString = ''
		hmtlString = '<h1 class="itemTitle">' + imageObject.title + '</h1>' +
					'<div class="detailImageView">' +
						'<img class="imageDetail" src="' + imagesOfObject.url_570xN + '">' + 
						'<div class="smallerImagesDetail">\
							<img class="smallerDetailImage" src="' + imageObject.Images[1].url_75x75 + '">' +
							'<img class="smallerDetailImage" src="' + imageObject.Images[2].url_75x75 + '">' +
							'<img class="smallerDetailImage" src="' + imageObject.Images[3].url_75x75 + '"></div>' +
					'</div>' +
					'<div class="detailDescriptionView">' +
					'<p>' + imageObject.description.substring(0,500) + '</p>' +
					'<ul class="categoriesPath"><strong>Overview</strong>' +
						'<li>Available for sale: ' + imageObject.quantity + '</li>' +
						'<li>Material: ' + imageObject.materials[0] + '</li>' +
						'<li>Favored by: ' + imageObject.num_favorers + '</li>' +
						'<li class="listingsFromArtist" value="' + imageObject.user_id + '">Other listings from artist</li>' +
						'</ul>' +
					'<p>' + imageObject.price + '     ' + imageObject.currency_code + '</p>' +
					'<button class="addToCart">Add To Shopping Cart</button>' +
					'</div>'
		this.el.innerHTML = hmtlString	
	},
	events: {
		"click li": "changeView"
	},
	changeView: function(clickEvent) {
		var userId = clickEvent.target.value
		console.log(userId)
		location.hash = "user/" + userId 
	}
})
var SearchView = Backbone.View.extend({
	el: ".mainContainer",
	startLoad: 0,
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	nextPage: function(clickEvent) {
		this.startLoad += 8
		this.render() 
	},
	hmtlString: '',
	render: function() {
		var startIndex = this.startLoad
		var dataObject = this.model.attributes.results
		//console.log(dataObject)
		for (var i = startIndex; i < startIndex + 8; i++) {
			var imagesArray = dataObject[i].Images
			console.log(imagesArray.length)
			this.hmtlString += 	
						'<div class="etsyItem">' + '<img class"imageItem" id="'+ dataObject[i].listing_id +'" src="' + imagesArray[0].url_170x135 + '">' +
						'<p class="description">' + dataObject[i].description.substring(0,30) + '</p>' +
						'<p class="title">' + dataObject[i].title.substring(0,12) + '</p>' +
						'<span class="price">' + dataObject[i].price + '     ' + dataObject[i].currency_code + '</span>' +
						'</div>' 
		}
		this.el.innerHTML = '<h2 class="pageIntroText">Discover Items you can\'t find anywhere else</h2>' + 
						this.hmtlString +
						'<div class="loadMore">\
						<p>Load more</p>\
						</div>'
	},
	events: {
		"click img": "changeView",
		"click .loadMore": "nextPage"
	},
	changeView: function(clickEvent) {
		var listingId = clickEvent.target.id
		//console.log(listingId)
		location.hash = "detail/" + listingId 
	}
})
var UserView = Backbone.View.extend ({
	el: ".mainContainer",
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	render: function(data) {
		console.log(data)
	}
})
var SortView = Backbone.View.extend({
	el: ".mainContainer",
	startLoad: 0,
	changeStartNum: function() {
		this.startLoad += 8
		this.render() 
	},
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	hmtlString: '',
	render: function() {
		var startIndex = this.startLoad
		var dataObject = this.model.attributes.results
		//console.log(dataObject)
		
		for (var i = startIndex; i < startIndex + 8; i++) {
			if (dataObject[i].price < 25) {
			var imagesArray = dataObject[i].Images
			//console.log(imagesArray)
			this.hmtlString +=
						'<div class="etsyItem">' + '<img class"imageItem" id="'+ dataObject[i].listing_id +'" src="' + imagesArray[0].url_170x135 + '">' +
						'<p class="description">' + dataObject[i].description.substring(0,30) + '</p>' +
						'<p class="title">' + dataObject[i].title.substring(0,12) + '</p>' +
						'<span class="price">' + dataObject[i].price + '     ' + dataObject[i].currency_code + '</span>' +
						'</div>' 
			}
		}
		this.el.innerHTML =  '<input class="sortOptions" value="under25" type="checkbox">Under $25' + '<input class="sortOptions" value="has3pictures" type="checkbox">Has 3 images or more' +
						'<h2 class="pageIntroText">Discover Items you can\'t find anywhere else</h2>' +
						this.hmtlString +
						'<div class="loadMore">\
						<p>Load more</p>\
						</div>'
	},
	events: {
		"click img": "changeView",
		"click .loadMore": "changeStartNum",
		'click [type="checkbox"]': "sortView"
	},
	changeView: function(clickEvent) {
		var listingId = clickEvent.target.id
		//console.log(listingId)
		location.hash = "detail/" + listingId 
	},
	sortView: function(e) {
		if (e.target.value === "under25") {
			location.hash = "under25" 
		}
		if (e.target.value === "has3pictures") {
			location.hash = "has3images"
		}
	}
})
var ImageSortView = Backbone.View.extend ({
	el: ".mainContainer",
	startLoad: 0,
	changeStartNum: function() {
		this.startLoad +=8
		this.render() 
	},
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	hmtlString: '',
	render: function() {
		var startIndex = this.startLoad
		var dataObject = this.model.attributes.results
		//console.log(dataObject)
		for (var i = startIndex; i < startIndex + 8; i++) {
			var imagesArray = dataObject[i].Images
			if (imagesArray.length > 3) {
			//console.log(imagesArray)
			this.hmtlString +=
						'<div class="etsyItem">' + '<img class"imageItem" id="'+ dataObject[i].listing_id +'" src="' + imagesArray[0].url_170x135 + '">' +
						'<p class="description">' + dataObject[i].description.substring(0,30) + '</p>' +
						'<p class="title">' + dataObject[i].title.substring(0,12) + '</p>' +
						'<span class="price">' + dataObject[i].price + '     ' + dataObject[i].currency_code + '</span>' +
						'</div>' 
			}
		}
		this.el.innerHTML =  '<input class="sortOptions" value="under25" type="checkbox">Under $25' + '<input class="sortOptions" value="has3pictures" type="checkbox">Has 3 images or more' +
						'<h2 class="pageIntroText">Discover Items you can\'t find anywhere else</h2>' +
						this.hmtlString +
						'<div class="loadMore">\
						<p>Load more</p>\
						</div>'
	},
	events: {
		"click img": "changeView",
		"click .loadMore": "changeStartNum",
		'click [type="checkbox"]': "sortView"
	},
	changeView: function(clickEvent) {
		var listingId = clickEvent.target.id
		//console.log(listingId)
		location.hash = "detail/" + listingId 
	},
	sortView: function(e) {
		if (e.target.value === "under25") {
			location.hash = "under25" 
		}
		if (e.target.value === "has3pictures") {
			location.hash = "has3images"
		}
	}
})


// Main Router 

var EtsyRouter = Backbone.Router.extend({
	routes: {
		"search/:searchQuery": "handleSearch",
		"home/": "handleHomeView",
		"detail/:id": "handleDetailView",
		"user/:userId": "handleUserIdView",
		"under25": "handleSortView",
		"has3images": "handleImagesSortView",
		"*default": "handleDefault"
	},
	handleHomeView: function(search) {
		var newHomeModel = new HomeModel()
		var newHomeView = new HomeView(newHomeModel)
		newHomeModel.fetch(search)
	},
	handleDetailView: function(id) {
		var newDetailModel = new DetailModel()
		newDetailModel.generateUrl(id)
		var newDetailView = new DetailView(newDetailModel)
		newDetailModel.fetch()
	},
	handleDefault: function() {
		location.hash = "home/"
	},
	handleImagesSortView: function() {
		var sim = new HomeModel()
		var homeImageSortView = new ImageSortView(sim)
		sim.fetch()
	},
	handleSearch: function(searchQuery) {
		var sm = new SearchModel()
		sm.generateUrl(searchQuery)
		var sv = new SearchView(sm)
		sm.fetch()
	},
	handleUserIdView: function(userId) {
		var um = new UserModel()
		um.generateUrl(userId)
		var uv = new UserView(um)
		um.fetch()
	},
	handleSortView: function() {
		var sm = new HomeModel()
		var homeSortView = new SortView(sm)
		sm.fetch()
	},
	initialize: function() {
		Backbone.history.start()
	}
})
function changeHash (keydown) {
	var search = keydown.target
	if (keydown.keyCode ===13) {
		searchQuery = search.value
		console.log(searchQuery)
		location.hash = "search/" + searchQuery
		search.value = ''
	}
}

var searchBox = document.querySelector(".search")
searchBox.addEventListener("keydown", changeHash)


var rtr = new EtsyRouter()