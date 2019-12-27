( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the booking form component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['classic-content-block-two'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'classic-content-block-two',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the booking form component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['classic-cta-banner'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'classic-cta-banner',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the booking form component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['booking-form'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'booking-form',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Gallery component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components.gallery = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'gallery',
				images:         [],
				columns:        5,
				size:           'medium',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the locations component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components.locations = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'locations',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the map component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components.map = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'map',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Opening Hours component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['opening-hours'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'opening-hours',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Contact Form 7 component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['classic-contact-form-7'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'classic-contact-form-7',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Menus component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['posts-menus'] = clc.Models.components.posts.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'posts-menus',
				title:          '',
				items:          [],
				limit_posts:    1,
				post_types:     'fdm-menu',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Pages component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['posts-pages'] = clc.Models.components.posts.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'posts-pages',
				title:          '',
				items:          [],
				limit_posts:    1,
				post_types:     'page',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Reviews component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['posts-reviews'] = clc.Models.components.posts.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'posts-reviews',
				title:          '',
				items:          [],
				limit_posts:    1,
				post_types:     'grfwp-review',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Recent posts component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['classic-recent-posts'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				number:         3,
				title:          '',
				show_date:      0,
				type:           'classic-recent-posts',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Upcoming Events component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['upcoming-events'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				number:         3,
				title:          '',
				type:           'upcoming-events',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Booking Form form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['booking-form'] = clc.Views.BaseComponentForm.extend({
        template: wp.template( 'clc-component-booking-form' )
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Gallery form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls.gallery = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-gallery' ),

		className: 'clc-component-gallery',

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'reordered': 'reordered',
			'click .select-image': 'openMedia',
		},

		image_thumb_urls: [],

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			if ( this.image_thumb_urls.length && this.model.get( 'images' ).length ) {
				this.renderThumbs();

			// Fetch the thumbnail URL from the server if we don't yet have one
		} else if ( this.model.get( 'images' ).length ) {
				$.ajax({
					url: CLC_Control_Settings.root + '/content-layout-control/v1/components/gallery/thumb-urls/' + this.model.get( 'images' ).join( ',' ),
					type: 'GET',
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', CLC_Control_Settings.nonce );
					},
					complete: _.bind( function( r ) {
						var urls = [];
						if ( typeof r.success !== 'undefined' && r.success() && typeof r.responseJSON !== 'undefined' ) {
							urls = r.responseJSON;
						}

						this.image_thumb_urls = urls;
						this.renderThumbs();
					}, this )
				});
			}
		},

		/**
		 * Open the media modal
		 *
		 * @since 0.1
		 */
		openMedia: function( event ) {
			event.preventDefault();

			if ( !this.media ) {
				this.initMedia();
			}

			this.media.open();

		},

		/**
		 * Create a media modal
		 *
		 * @since 0.1
		 */
		initMedia: function() {
			this.media = wp.media({
				state: 'gallery-library',
				frame: 'post',
			});
			this.media.on( 'close', _.bind( this.selectImage, this ) );
		},

		/**
		 * Receive the selected images from the media modal and assign them to
		 * the control
		 *
		 * @since 0.1
		 */
		selectImage: function() {
			var attachments = [],
				image_thumb_urls = [],
				library = this.media.states.get( {id: 'gallery-edit'} ).get( 'library' );

			library.each( function( model, i, collection )  {

				attachments.push( model.get( 'id') );

				if ( typeof model.get( 'sizes' ).medium !== 'undefined' && model.get( 'sizes' ).medium.width >= 238 ) {
					image_thumb_urls.push( model.get( 'sizes' ).medium.url );
				} else if ( typeof model.get( 'sizes' ).full !== 'undefined' ) {
					image_thumb_urls.push( model.get( 'sizes' ).full.url );
				} else {
					image_thumb_urls.push( '' );
				}
			} );

			this.image_thumb_urls = image_thumb_urls;
			this.model.set({
				images: attachments,
				columns: library.gallery.get('columns'),
				size: library.gallery.get('size'),
			});
			this.render();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
		},

		/**
		 * Add the image thumbnail preview
		 *
		 * This should normally be set with the template. However, in some cases
		 * we'll need to set it by making an end-run to the server to fetch the
		 * url. In such cases, we can slot it in when it returns without
		 * re-rendering the whole view.
		 *
		 * @since 0.1
		 */
		renderThumbs: function() {
			var html = '';
			for ( var i in this.image_thumb_urls ) {
				html += '<img src="' + this.image_thumb_urls[i] + '">';
			}
			this.$el.find( '.thumb' ).removeClass( 'loading' ).html( html );
		},
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Locations form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls.locations = clc.Views.BaseComponentForm.extend({
        template: wp.template( 'clc-component-locations' )
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Map form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls.map = clc.Views.BaseComponentForm.extend({
        template: wp.template( 'clc-component-map' )
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Opening Hours form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['opening-hours'] = clc.Views.BaseComponentForm.extend({
        template: wp.template( 'clc-component-opening-hours' )
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Menus form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['posts-menus'] = clc.Views.component_controls.posts.extend({
        template: wp.template( 'clc-component-posts-menus' ),
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Pages form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['posts-pages'] = clc.Views.component_controls.posts.extend({
        template: wp.template( 'clc-component-posts-pages' ),
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Reviews form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['posts-reviews'] = clc.Views.component_controls.posts.extend({
        template: wp.template( 'clc-component-posts-reviews' ),
    });

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Recent Posts form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['recent-posts'] = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-recent-posts' ),

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'change [data-clc-setting-link]': 'updateLinkedSetting',
			'keyup [data-clc-setting-link]': 'updateTextLive',
			'change [data-clc-show-date-link]': 'updateShowDateSetting',
			'reordered': 'reordered',
		},

		/**
		 * Update text inputs in the browser without triggering a full
		 * component refresh
		 *
		 * @since 0.1
		 */
		updateTextLive: function( event ) {
			var target = $( event.target );

			wp.customize.previewer.send(
				'component-setting-changed-' + this.model.get( 'id' ) + '.clc',
				{
					setting: target.data( 'clc-setting-link' ),
					val: target.val()
				}
			);
		},

		/**
		 * Update the show_date setting
		 *
		 * This can't use the updateLinkedSetting helper because it passes the
		 * value whether of a checkbox whether it's checked or not.
		 *
		 * @since 0.1
		 */
		updateShowDateSetting: function( event ) {
			var val = $( event.target ).is( ':checked' ) ? 1 : 0;

			if ( this.model.get( 'show_date' ) === val ) {
				return;
			}

			this.model.set( { show_date: val } );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Upcoming Events form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['upcoming-events'] = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-upcoming-events' ),

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'change [data-clc-setting-link]': 'updateLinkedSetting',
			'keyup [data-clc-setting-link]': 'updateTextLive',
			'reordered': 'reordered',
		},

		/**
		 * Update text inputs in the browser without triggering a full
		 * component refresh
		 *
		 * @since 0.1
		 */
		updateTextLive: function( event ) {
			var target = $( event.target );

			wp.customize.previewer.send(
				'component-setting-changed-' + this.model.get( 'id' ) + '.clc',
				{
					setting: target.data( 'clc-setting-link' ),
					val: target.val()
				}
			);
		},
	});

} )( jQuery );
