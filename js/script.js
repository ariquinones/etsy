console.log("Etsy")

// Models 
var HomeModel = Backbone.Model.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
})
var DetailModel = Backbone.Model.extend({
	generateUrl: function(id) {
		this.url = 'https://openapi.etsy.com/v2/listings/'+ id +'.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
		//'https://openapi.etsy.com/v2/listings/' + id + '.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
	} 
})


// Views 
var HomeView = Backbone.View.extend({
	el: ".mainContainer",
	startLoad: 0,
	changeStartNum: function() {
		this.startLoad += 12
		this.render() 
	},
	initialize: function(someModel) {
		this.model = someModel
		invokeRender = this.render.bind(this)
		this.model.on('sync', invokeRender)
	},
	render: function() {
		var startIndex = this.startLoad
		var dataObject = this.model.attributes.results
		//console.log(dataObject)
		var hmtlString = ''
		for (var i = startIndex; i < startIndex + 12; i++) {
			var imagesArray = dataObject[i].Images
			console.log(imagesArray)
			hmtlString += 	
						'<div class="etsyItem">' + '<img class"imageItem" id="'+ dataObject[i].listing_id +'" src="' + imagesArray[0].url_170x135 + '">' +
						'<p class="description">' + dataObject[i].description.substring(0,30) + '</p>' +
						'<p class="title">' + dataObject[i].title.substring(0,12) + '</p>' +
						'<span class="price">' + dataObject[i].price + '     ' + dataObject[i].currency_code + '</span>' +
						'</div>' 
		}
		this.el.innerHTML = '<h2 class="pageIntroText">Discover Items you can\'t find anywhere else</h2>' +
						hmtlString +
						'<div class="loadMore">\
						<p>Load more</p>\
						</div>'
	},
	events: {
		"click img": "changeView",
		"click .loadMore": "changeStartNum"
	},
	changeView: function(clickEvent) {
		var listingId = clickEvent.target.id
		//console.log(listingId)
		location.hash = "detail/" + listingId 
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
		var pageHeading = document.querySelector('.pageIntroText')
		pageHeading.innerHTML = ''
		var imageObject = data.attributes.results[0]
		console.log(imageObject)
		var imagesOfObject = imageObject.Images[0] 
		console.log(imagesOfObject)
		var hmtlString = ''
		hmtlString = '<h1 class="itemTitle">' + imageObject.title + '</h1>' +
					'<div class="detailImageView">' +
					'<img class="imageDetail" src="' + imagesOfObject.url_570xN + '">' + '</div>' +
					'<div class="detailDescriptionView">' +
					'<p>' + imageObject.description + '</p>' +
					'<ul class="categoriesPath"><strong>Overview</strong>' +
						'<li>Available for sale: ' + imageObject.quantity + '</li>' +
						'<li>Material: ' + imageObject.materials[0] + '</li>' +
						'<li>Favored by: ' + imageObject.num_favorers + '</li>' +
					'</ul>' +
					'<p>' + imageObject.price + '     ' + imageObject.currency_code + '</p>' +
					'<button class="addToCart">Add To Shopping Cart</button>' +
					'</div>'
		this.el.innerHTML = hmtlString	
	}
})

// Main Router 

var EtsyRouter = Backbone.Router.extend({
	routes: {
		"home/": "handleHomeView",
		"detail/:id": "handleDetailView",
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
	initialize: function() {
		Backbone.history.start()
	}
})


var rtr = new EtsyRouter()