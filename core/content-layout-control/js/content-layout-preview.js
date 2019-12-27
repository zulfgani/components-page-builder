( function( $ ) {
	/**
	 * Namespace for base controls, models, collections and views used by the
	 * Content Layout control. Individual component models and views are defined
	 * separately in /components.
	 *
	 * @since 0.1
	 */
	var clc = wp.customize.ContentLayoutControl = {};

	/**
	 * Define common functions
	 *
	 * @since 0.1
	 */
	clc.Functions = {

		/**
		 * Add a nonce to the request headers in ajax requests
		 *
		 * @since 0.1
		 */
		getRequestHeader: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', CLC_Control_Settings.nonce );
		}
	};

	/**
	 * Define models
	 *
	 * Each component should have a corresponding model that extends the
	 * Component model.
	 *
	 * @since 0.1
	 */
	clc.Models = {
		/**
		 * Base component model
		 *
		 * @augments Backbone.Model
		 * @since 0.1
		 */
		Component: Backbone.Model.extend({
			defaults: {
				id:          0,
				name:        '',
				description: '',
				type:        '',
				order:       0
			}
		}),

		/**
		 * Hash of component models
		 *
		 * @since 0.1
		 */
		components: {}
	};

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl || {};

	/**
	 * Views
	 *
	 * @since 0.1
	 */
	clc.Views = clc.Views || {};

	/**
	 * Base view for component layouts
	 *
	 * These aren't traditional Backbone Views. They'll just fetch and
	 * inject HTML from the server. Using Views allows us to take advantage
	 * of Backbone's cleanup of listeners and provides a consistent way to
	 * tie listeners to the dom element.
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.BaseComponentPreview = wp.Backbone.View.extend({
		template: null, // doesn't use template. injects HTML passed from the server

		events: {
			'click .clc-edit-component': 'editComponent',
		},

		/**
		 * Initialize
		 *
		 * @since 0.1
		 */
		initialize: function( options ) {
			this.listenTo( this.model, 'change', this.load );
		},

		/**
		 * Load HTML and insert into the DOM
		 *
		 * @since 0.1
		 */
		load: function() {
			this.fetchHTML();
		},

		/**
		 * Fetch HTML from the server for the attached model
		 *
		 * @since 0.1
		 */
		fetchHTML: function() {
			this.$el.addClass( 'clc-loading' );
			$.ajax({
				url: CLC_Preview_Settings.root + '/content-layout-control/v1/render-components',
				type: 'POST',
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', CLC_Preview_Settings.nonce );
				},
				data: this.model.attributes,
				complete: _.bind( this.handleResponse, this )
			});
		},

		/**
		 * Handle ajax response
		 *
		 * @since 0.1
		 */
		handleResponse: function( r ) {
			var html = '';
			if ( typeof r.success !== 'undefined' && r.success && typeof r.responseJSON !== 'undefined' ) {
				html = r.responseJSON;
			}

			this.$el.removeClass( 'clc-loading' );
			this.injectHTML( html );
			this.$el.trigger( 'component-preview-updated.clc', [this.$el, this.model, this] );
		},

		/**
		 * Inject HTML into the dom
		 *
		 * @since 0.1
		 */
		injectHTML: function( html ) {
			html += '<a href="#" class="clc-edit-component">' + CLC_Preview_Settings.i18n.edit_component + '</a>';
			this.$el.html( html );
		},

		/**
		 * Open the control and the component attached to this layout
		 *
		 * @since 0.1
		 */
		editComponent: function( event ) {
			event.preventDefault();
			event.stopPropagation();

			wp.customize.preview.send( 'edit-component.clc', this.model.get( 'id' ) );
		}

	});

	/**
	 * Hash of component layout views
	 *
	 * @since 0.1
	 */
	clc.Views.component_previews = {};

	/**
	 * Handler for the live preview
	 *
	 * @since 0.1
	 */
	clc.preview = {
		/**
		 * Current page/post being previewed
		 *
		 * @since 0.1
		 */
		current: {},

		/**
		 * Models currently being handled
		 *
		 * @since 0.1
		 */
		models: {},

		/**
		 * Views currently being handled
		 *
		 * @since 0.1
		 */
		views: {},

		/**
		 * Initialize
		 *
		 * @since 0.1
		 */
		init: function( data ) {
			_.bindAll( this, 'reset', 'refresh', 'add', 'destroyViews' );
			this.reset( data );
		},

		/**
		 * Reset data on page loads
		 *
		 * @since 0.1
		 */
		reset: function( data ) {
			this.destroyViews();
			this.models = this.views = {};
			this.current = data;
			wp.customize.preview.send( 'previewer-reset.clc', clc.preview.current );
		},

		/**
		 * Refresh the layout. Goes to the server for a complete render.
		 *
		 * @params array components Array of components to render
		 * @since 0.1
		 */
		refresh: function( components ) {
			this.destroyViews();
			$( '#content-layout-control' ).empty();
			for( var i in components ) {
				this.add( components[i] );
			}
		},

		/**
		 * Add component view
		 *
		 * @since 0.1
		 */
		add: function( component ) {

			if ( typeof clc.Views.component_previews[component.type] === 'undefined' ) {
				return;
			}

			$( '#content-layout-control' ).append( '<div id="content-layout-control-' + component.id + '" class="clc-component-layout clc-component-' + component.type + '"></div>' );
			this.views[component.id] = new clc.Views.component_previews[component.type]( {
				el: '#content-layout-control-' + component.id,
				model: new Backbone.Model( component )
			} );
			this.views[component.id].load();
		},

		/**
		 * Update a view when a model has changed
		 *
		 * @since 0.1
		 */
		update: function( component ) {
			if ( typeof this.views[component.id] == 'undefined' ) {
				return;
			}

			// Trigger the change event manually. This ensures the component
			// will be refreshed even if Backbone can't detect an attribute
			// change. This happens with attributes that are objects or arrays.
			// Backbone doesn't check for changes recursively.
			this.views[component.id].model.set( component, { silent: true } );
			this.views[component.id].model.trigger( 'change', this.views[component.id].model );
		},

		/**
		 * Remove component view
		 *
		 *  @since 0.1
		 */
		remove: function( component ) {
			if ( typeof this.views[component.id] == 'undefined' ) {
				return;
			}

			this.views[component.id].remove();
		},

		/**
		 * Destroy the existing views to unbind events
		 *
		 * @since 0.1
		 */
		destroyViews: function() {
			for( var i in this.views ) {
				this.views[i].remove();
			}
		}
	};

	/**
	 * Bind to component change events
	 *
	 * @since 0.0.1
	 */
	$( function() {

		// Fixes #3: REST endpoints don't exist when switching themes in the
		// customizer
		//
		// This adds data to the request which tells WordPress to load the theme
		// that's currently being previewed, so that REST endpoints defined in the
		// the theme are available.
		$.ajaxPrefilter( function( options, originalOptions ) {

			// Only tamper with content-layout-control requests
			if ( typeof originalOptions.url == 'undefined' ||  originalOptions.url.indexOf( CLC_Preview_Settings.root + '/content-layout-control' ) < 0 ) {
				return;
			}

			options.data = options.data ? options.data + '&' : '';
			options.data += $.param( {
				wp_customize: 'on',
				theme: CLC_Preview_Settings.previewed_theme,
				nonce: CLC_Preview_Settings.preview_nonce
			} );
		} );

		// Send updated post data to the controller
		wp.customize.preview.bind( 'active', function() {
			clc.preview.init( clc_customize_preview_data );
		});

		wp.customize.preview.bind( 'component-added.clc', function( component ) {
			clc.preview.add( component );
		});

		wp.customize.preview.bind( 'component-removed.clc', function( component ) {
			clc.preview.remove( component );
		});

		wp.customize.preview.bind( 'component-changed.clc', function( component ) {
			clc.preview.update( component );
		});

		wp.customize.preview.bind( 'refresh-layout.clc', function( components ) {
			clc.preview.refresh( components );
		});
	} );

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Content Block component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['content-block'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'content-block',
				image:          0,
				image_position: 'left',
				title:          '',
				content:        '',
				links:          [],
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Content Block component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components['content-block-two'] = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'content-block-two',
				image:          0,
				image_position: 'left',
				title:          '',
				content:        '',
				links:          [],
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Posts component
	 *
	 * @augments Backbone.Model
	 * @since 0.1
	 */
	clc.Models.components.posts = clc.Models.Component.extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'posts',
				title:          '',
				items:          [],
				limit_posts:    0,
				post_types:     'any',
				order:          0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Content Block layout
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_previews['content-block'] = clc.Views.BaseComponentPreview.extend({
		/**
		 * Initialize
		 *
		 * @since 0.1
		 */
		initialize: function( options ) {
			this.listenTo( this.model, 'change', this.load );
			_.bindAll( this, 'settingChanged' );
			wp.customize.preview.bind( 'component-setting-changed-' + this.model.get( 'id' ) +'.clc', this.settingChanged );
		},

		/**
		 * Update the text settings immediately in the browser
		 *
		 * @since 0.1
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'image-position' ) {
				this.updateImagePosition( data.val );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Fires when view is destroyed
		 *
		 * @since 0.1
		 */
		remove: function() {
			// Clean up events bound to wp.customize.preview when the view is removed
			wp.customize.preview.unbind( 'component-setting-changed-' + this.model.get( 'id' ) +'.clc', this.settingChanged );

			Backbone.View.prototype.remove.apply( this );
		},

		/**
		 * Update the image position
		 *
		 * @since 0.1
		 */
		updateImagePosition: function( position ) {
			this.$el.find( '.clc-wrapper' ).removeClass( 'image-position-left image-position-right' )
				.addClass( 'image-position-' + position );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Content Block layout
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_previews['content-block-two'] = clc.Views.BaseComponentPreview.extend({
		/**
		 * Initialize
		 *
		 * @since 0.1
		 */
		initialize: function( options ) {
			this.listenTo( this.model, 'change', this.load );
			_.bindAll( this, 'settingChanged' );
			wp.customize.preview.bind( 'component-setting-changed-' + this.model.get( 'id' ) +'.clc', this.settingChanged );
		},

		/**
		 * Update the text settings immediately in the browser
		 *
		 * @since 0.1
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'image-position' ) {
				this.updateImagePosition( data.val );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Fires when view is destroyed
		 *
		 * @since 0.1
		 */
		remove: function() {
			// Clean up events bound to wp.customize.preview when the view is removed
			wp.customize.preview.unbind( 'component-setting-changed-' + this.model.get( 'id' ) +'.clc', this.settingChanged );

			Backbone.View.prototype.remove.apply( this );
		},

		/**
		 * Update the image position
		 *
		 * @since 0.1
		 */
		updateImagePosition: function( position ) {
			this.$el.find( '.clc-wrapper' ).removeClass( 'image-position-left image-position-right' )
				.addClass( 'image-position-' + position );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Posts layout
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_previews.posts = clc.Views.BaseComponentPreview.extend();

} )( jQuery );
