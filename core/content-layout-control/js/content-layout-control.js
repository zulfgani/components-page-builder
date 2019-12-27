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
	 * Collections
	 *
	 * @since 0.1
	 */
	clc.Collections = clc.Collections || {};

	/**
	 * Collection of components that have been added to the layout control
	 *
	 * @augments Backbone.Collection
	 * @since 0.1
	 */
	clc.Collections.Added = Backbone.Collection.extend({

		initialize: function( models, options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control' ) );

			this.listenTo( this, 'add remove', _.bind( this.control.updateSetting, this.control ) );
			this.listenTo( this, 'add', this.sendAddEvent );
			this.listenTo( this, 'remove', this.sendRemoveEvent );
		},

		comparator: function( model ) {
			return model.get( 'order' );
		},

		sendAddEvent: function( model ) {
			wp.customize.previewer.send( 'component-added.clc', model );
		},

		sendRemoveEvent: function( model ) {
			wp.customize.previewer.send( 'component-removed.clc', model );
		},

		// Generate an array of attributes to pass to the setting
		generateArray: function() {
			var output = [];
			this.each( function( model ) {
				output.push( model.attributes );
			});

			return output;
		}
	});

	/**
	 * Views
	 *
	 * @since 0.1
	 */
	clc.Views = clc.Views || {};

	/**
	 * Secondary control panel
	 *
	 * This view implements a secondary control panel for expanded selection
	 * and input. It acts as a generic event bridge for communicating
	 * between actions in the panel and their associated control/component.
	 *
	 * @since 0.1
	 */
	clc.Views.SecondaryPanel = wp.Backbone.View.extend({
		template: wp.template( 'clc-secondary-panel' ),

		id: 'clc-secondary-panel',

		events: {
			'click .clc-close': 'close',
		},

		initialize: function( options ) {
			_.extend( this, _.pick( options, 'control' ) );

			this.listenTo( this, 'load-secondary-panel.clc', this.load );
			this.listenTo( this, 'close-secondary-panel.clc', this.close );
		},

		/**
		 * Load a new panel
		 *
		 * @param view wp.Backbone.View view to load
		 * @since 0.1
		 */
		load: function( view, component ) {

			$( 'body' ).addClass( 'clc-secondary-open' );

			// Broadcast the close event for the previous view
			if ( this.views.first( '.clc-secondary-content' ) ) {
				this.sendClose();
			}

			// Update the view
			this.views.set( '.clc-secondary-content', view );

			// Update focus
			this.views.first( '.clc-secondary-content' ).$el
				.find( 'label, input, textarea, select, a, button' ).first().focus();

			// Update component
			delete this.component;
			if ( typeof component !== 'undefined' ) {
				this.component = component;
			}

		},

		/**
		 * Close the panel
		 *
		 * @since 0.1
		 */
		close: function() {
			this.sendClose();
			$( 'body' ).removeClass( 'clc-secondary-open' );
		},

		/**
		 * Send an event to the attached control/component
		 *
		 * @param string name Trigger name. Should be namespaced: anything.clc
		 * @param object data Optional data to pass with the event
		 * @since 0.1
		 */
		send: function( name, data ) {
			if ( typeof this.control !== 'undefined' ) {
				this.control.container.trigger( name, data );
			}
			if ( typeof this.component !== 'undefined' ) {
				this.component.trigger( name, data );
			}
		},

		/**
		 * Send closed event
		 *
		 * @since 0.1
		 */
		sendClose: function() {
			this.send( 'secondary-panel-closed.clc', this.views.first( '.clc-secondary-content' ) );
		}
	});

	/**
	 * Summary of a component to appear in selection lists
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.ComponentSummary = wp.Backbone.View.extend({
		tagName: 'li',

		template: wp.template( 'clc-component-summary' ),

		events: {
			'click': 'add'
		},

		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control' ) );
		},

		add: function( event ) {
			event.preventDefault();
			this.control.addComponent( this.model.get( 'type' ) );
			this.control.closeComponentPanel();
		}
	});

	/**
	 * List of components available for selection
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.ComponentList = wp.Backbone.View.extend({
		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control' ) );
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			this.$el.empty();
			var list = $( '<ul></ul>' );
			this.collection.each( function( model ) {
				list.append( new clc.Views.ComponentSummary( { model: model, control: this.control } ).render().el );
			}, this );
			this.$el.append( list  );
		}
	});

	/**
	 * List of components added to control
	 *
	 * @augments wp.Backone.View
	 * @since 0.1
	 */
	clc.Views.AddedList = wp.Backbone.View.extend({
		// List of components in an "open" state
		open_components: [],

		events: {
			'update-sort': 'updateSort',
		},

		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control' ) );

			this.listenTo(this.collection, 'add remove reset', this.render);
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			this.$el.empty();
			this.collection.each( function( model ) {
				if ( typeof clc.Views.component_controls[ model.get('type') ] !== 'undefined' ) {
					var is_open = this.open_components.indexOf( model.get( 'id' ) ) > -1;
					var view = new clc.Views.component_controls[ model.get('type') ]( { model: model, control: this.control, is_open: is_open } );
					view.render();
					this.$el.append( view.el );
				}
			}, this );
		},

		updateSort: function( event, model, position ) {

			this.collection.remove( model );
			this.collection.add( model, { at: position } );

			this.collection.each(function( model, index ) {
				model.set( 'order', index );
			});

			this.collection.sort();

			wp.customize.previewer.send( 'refresh-layout.clc', this.collection.generateArray() );
		},

		/**
		 * Reset the open_components list when the collection is replaced
		 * whole-sale
		 *
		 * @since 0.1
		 */
		resetComponentStates: function() {
			this.open_components = [];
		}
	});

	/**
	 * Base view for component configuration forms
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.BaseComponentForm = wp.Backbone.View.extend({
		template: null, // base views must define a template: wp.template( id )

		tagName: 'li',

		className: 'clc-component-base',

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'reordered': 'reordered',
		},

		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control', 'is_open' ) );

			// Preserves expanded/collapsed state as the user browses around
			this.setDisplayClass();

			this.listenTo(this.model, 'change', this.componentChanged);
			this.listenTo(this.model, 'focus', this.focus);
		},

		/**
		 * By default this will fire whenever the model is changed. The
		 * base view will send an event to the preview frame that will
		 * request a complete refresh of the component. Overwite this
		 * if you want to perform some content updates without re-fetching
		 * the component from the server.
		 *
		 * @since 0.1
		 */
		componentChanged: function( model ) {
			this.control.updateSetting();
			wp.customize.previewer.send( 'component-changed.clc', model );
		},

		/**
		 * Delete this component from the list of added components
		 *
		 * @since 0.1
		 */
		delete: function() {
			this.control.removeComponent( this.model );
			this.remove();
		},

		/**
		 * Update model values that are synced to an input element via
		 * a `data-clc-setting-link` attribute.
		 *
		 * This provides easy value binding modeled after the Customizer,
		 * but it will only work for basic input fields where the value
		 * can be retrieved with .val().
		 *
		 * The default view sends a component-changed event whenever the
		 * model changes, which will trigger a call  back to the server to
		 * re-render the entire component. Don't use this for update-as-you-
		 * type or other high-frequency changes, unless you disable the
		 * listener which fires this.componentChanged(), or overwrite
		 * this.componentChanged() so it doesn't send the default event.
		 *
		 * @since 0.1
		 */
		updateLinkedSetting: function( event ) {
			var target = $( event.target );
			var setting = target.data( 'clc-setting-link' );
			var val = target.val();

			if ( this.model.get( setting ) === val ) {
				return;
			}

			var atts = {};
			atts[ setting ] = val;
			this.model.set( atts );
		},

		/**
		 * Triggers a resort on the collection when this model's order has
		 * been changed
		 *
		 * @since 0.1
		 */
		reordered: function( event, index ) {
			this.$el.trigger( 'update-sort', [this.model, index] );
		},

		/**
		 * Toggle the display status open/close
		 *
		 * @since 0.1
		 */
		toggleDisplay: function( event ) {
			if ( this.is_open ) {
				this.contract();
			} else {
				this.expand();
			}
		},

		/**
		 * Expand form
		 *
		 * @since 0.1
		 */
		expand: function() {
			this.is_open = true;
			this.setDisplayClass();
			if ( this.control.added_components_view.open_components.indexOf( this.model.get( 'id' ) ) < 0 ) {
				this.control.added_components_view.open_components.push( this.model.get( 'id' ) );
			}
		},

		/**
		 * Contract form
		 *
		 * @since 0.1
		 */
		contract: function() {
			this.is_open = false;
			this.setDisplayClass();
			var index = this.control.added_components_view.open_components.indexOf( this.model.get( 'id' ) );
			if ( index > -1 ) {
				this.control.added_components_view.open_components.splice( index, 1 );
			}
		},

		/**
		 * Set visibility class for the form
		 *
		 * @since 0.1
		 */
		setDisplayClass: function( state ) {
			if ( state || this.is_open ) {
				this.$el.addClass( 'is-open' );
			} else {
				this.$el.removeClass( 'is-open' );
			}
		},

		/**
		 * Open this component and focus on it
		 *
		 * @since 0.1
		 */
		focus: function() {
			this.expand();
			this.$el.find( '.clc-toggle-component-form' ).focus();
		}
	});

	/**
	 * Hash of component form views
	 *
	 * @since 0.1
	 */
	clc.Views.component_controls = {};


	/**
	 * Customizer Content Layout Control class
	 *
	 * @class
	 * @augments wp.customize.Control
	 * @augments wp.customize.Class
	 */
	clc.Control = wp.customize.Control.extend({
		/**
		 * Current post_id being controlled
		 *
		 * @since 0.1
		 */
		post_id: 0,

		/**
		 * Object hash of post setting values
		 *
		 * @since 0.1
		 */
		edited_posts: {},

		/**
		 * Load and render the control settings
		 *
		 * @abstract
		 * @since 0.1
		 */
		ready: function() {
			var control = this;

			// Initialize the secondary panel
			clc.secondary_panel = new clc.Views.SecondaryPanel({
				control: control,
			});
			clc.secondary_panel.render();
			$( '.wp-full-overlay' ).append( clc.secondary_panel.el );

			// Generate the collection of allowed components
			control.allowed_components = new Backbone.Collection();
			for( var i in control.params.components ) {
				var type = control.params.components[i];
				if ( typeof clc.Models.components[type] !== undefined ) {
					control.allowed_components.add( new clc.Models.components[type]( clc_components[type] ) );
				}
			}

			// Generate an (empty) collection of components added to this control
			control.added_components = new clc.Collections.Added( [], { control: control } );
			control.added_components_view = new clc.Views.AddedList({
				el: '#customize-control-' + control.id + ' .clc-content-list',
				collection: control.added_components,
				control: control
			});
			control.added_components_view.render();

			// Register events
			_.bindAll( control, 'createComponentListView', 'createLinkPanelView', 'toggleComponentPanel', 'openComponentPanel', 'closeComponentPanel', 'secondaryPanelClosed', 'addComponent', 'updateSetting', 'onPageRefresh', 'focusComponent' );
			control.container.on( 'click', '.add-component', control.toggleComponentPanel );
			control.container.on( 'secondary-panel-closed.clc', control.secondaryPanelClosed );
			wp.customize.previewer.bind( 'previewer-reset.clc', control.onPageRefresh );
			wp.customize.previewer.bind( 'edit-component.clc', control.focusComponent );

			// Make the list sortable
			$( '#customize-control-' + control.id + ' .clc-content-list' ).sortable({
				placeholder: 'clc-content-list-placeholder',
				delay: '150',
				handle: '.header',
				update: control.sortingComplete
			});
		},

		/**
		 * Update the setting value
		 *
		 * Interacts with core WP customizer to store the setting for us when
		 * saving or during full page reloads of the preview.
		 *
		 * @since 0.1
		 */
		updateSetting: function() {
			this.edited_posts[this.post_id] = this.added_components.generateArray();
			this.setting( [] ); // Clear it to ensure the change gets noticed
			this.setting( this.edited_posts );
		},

		/**
		 * Create the component list view and store reference
		 *
		 * @since 0.1
		 */
		createComponentListView: function() {
			this.component_list_view = new clc.Views.ComponentList({
				className: 'clc-component-list',
				collection: this.allowed_components,
				control: this
			});
			return this.component_list_view;
		},

		/**
		 * Create a a new post panel view
		 *
		 * Reference to the view should be stored in the component's control
		 *
		 * @since 0.1
		 */
		createPostPanelView: function( options ) {
			var opt = _.extend(
				options,
				{
					collection: new Backbone.Collection(),
				}
			);
			return new clc.Views.PostPanel( opt );
		},

		/**
		 * Create a a new link panel view
		 *
		 * Reference to the view should be stored in the component's control
		 *
		 * @since 0.1
		 */
		createLinkPanelView: function() {
			return new clc.Views.LinkPanel({
				collection: new Backbone.Collection(),
			});
		},

		/**
		 * Assign the appropriate collection and open or close the list
		 *
		 * @since 0.1
		 */
		toggleComponentPanel: function( event ) {
			event.preventDefault();

			if ( $( '#customize-control-' + this.id ).hasClass( 'clc-component-list-open' ) ) {
				this.closeComponentPanel();
			} else {
				this.openComponentPanel();
			}
		},

		/**
		 * Open the component list
		 *
		 * @since 0.1
		 */
		openComponentPanel: function() {
			clc.secondary_panel.trigger( 'load-secondary-panel.clc', this.createComponentListView() );
			$( '#customize-control-' + this.id ).addClass( 'clc-component-list-open' );
		},

		/**
		 * Close the component list
		 *
		 * @since 0.1
		 */
		closeComponentPanel: function() {
			clc.secondary_panel.trigger( 'close-secondary-panel.clc' );
		},

		/**
		 * React to the secondary panel being closed
		 *
		 * @since 0.1
		 */
		secondaryPanelClosed: function( event, view ) {
			if ( typeof this.component_list_view !== 'undefined' && view.cid === this.component_list_view.cid ) {
				$( '#customize-control-' + this.id ).removeClass( 'clc-component-list-open' );
			}
		},

		/**
		 * Add a component to the control
		 *
		 * @since 0.1
		 */
		addComponent: function( type ) {

			if ( typeof clc.Models.components[type] === undefined ) {
				console.log( 'No component model found for type: ' + type );
				return;
			}

			if ( !this.isAllowed( type ) ) {
				console.log( 'Tried to add unallowed component type: ' + type );
				return;
			}

			// Generate a unique ID for the model in this collection. Since it's
			// just an arbitrary id, it will sometimes match an existing
			// component. It should be rare so just re-generate an ID until we
			// find something unique.
			var get_unique_id = function( id, collection ) {
				return collection.get( id ) ? get_unique_id( _.uniqueId(), collection ) : id;
			};

			var atts = _.clone( clc_components[type] );
			atts.id = get_unique_id( _.uniqueId(), this.added_components );
			atts.order = this.added_components.length;

			this.added_components.add( new clc.Models.components[type]( atts ) );
		},

		/**
		 * Remove a component from the collection of added components
		 *
		 * @since 0.1
		 */
		removeComponent: function( model ) {
			this.added_components.remove( model );
		},

		/**
		 * Load component set for a new post id
		 *
		 * When a post is loaded in the previewer, the control needs to be
		 * updated with the correct set of components. This loads the added
		 * components collection and sends the current post's components back to
		 * the previewer to be updated.
		 *
		 * @param data object Data about the current post passed from the previewer
		 * @since 0.1
		 */
		onPageRefresh: function( data ) {

			// Clear out component open/closed state
			this.added_components_view.resetComponentStates();

			// The current previewer display is not a post
			if ( !data.post_id ) {
				this.post_id = 0;
				this.added_components.reset( [], { control: this } );
				return;
			}

			this.post_id = data.post_id;

			if ( typeof this.edited_posts[this.post_id] === 'undefined' ) {
				this.edited_posts[this.post_id] = this.createModels( data.components );
			}

			this.added_components.reset( this.edited_posts[this.post_id], { control: this } );

			wp.customize.previewer.send( 'refresh-layout.clc', this.added_components.generateArray() );
		},

		/**
		 * Instantiate models when passed an array of component objects
		 *
		 * @since 0.1
		 */
		createModels: function( components ) {
			var models = [];

			for ( var i in components ) {
				// Don't add un-allowed components. This prevents errors from
				// old data if allowed components change.
				// @TODO situations like this should alert the user and try to
				//  handle old data gracefully.
				if ( this.isAllowed( components[i].type ) ) {
					var atts = _.clone( clc_components[components[i].type]);
					models.push( new clc.Models.components[components[i].type]( _.extend( {}, atts, components[i] ) ) );
				}
			}

			return models;
		},

		/**
		 * Reset component order when list has been sorted
		 *
		 * @since 0.1
		 */
		sortingComplete: function( event, ui ) {
			ui.item.trigger( 'reordered', ui.item.index() );
		},

		/**
		 * Open and focus on a component
		 *
		 * @since 0.1
		 */
		focusComponent: function( id ) {
			this.focus();
			this.added_components.get( id ).trigger( 'focus' );
		},

		/**
		 * Send an event to the componentts
		 *
		 * @since 0.1
		 */
		sendEvent: function( event, data ) {
			this.added_components.each( function( model ) {
				model.trigger( event, data );
			});
		},

		/**
		 * Check if a component type is allowed
		 *
		 * @since 0.1
		 */
		isAllowed: function( type ) {
			return this.allowed_components.findWhere({ type: type });
		}
	});

	// Register the media control with the content_layout control type
	wp.customize.controlConstructor.content_layout = clc.Control;

	$( function() {

		// Fixes #3: REST endpoints don't exist when switching themes in the
		// customizer
		//
		// This adds data to the request which tells WordPress to load the theme
		// that's currently being previewed, so that REST endpoints defined in the
		// the theme are available.
		$.ajaxPrefilter( function( options, originalOptions ) {

			// Only tamper with content-layout-control requests
			if ( typeof originalOptions.url == 'undefined' || originalOptions.url.indexOf( CLC_Control_Settings.root + '/content-layout-control' ) < 0 ) {
				return;
			}

			options.data = options.data ? options.data + '&' : '';
			options.data += $.param( {
				wp_customize: 'on',
				theme: CLC_Control_Settings.previewed_theme,
				nonce: CLC_Control_Settings.preview_nonce
			} );
		} );

		// Open and focus on the content-layout-control if requested on load
		if ( CLC_Control_Settings.onload_focus_control == '1' ) {
			wp.customize.control('content_layout_control').focus();
		}
	} );

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl || {};

	/**
	 * Re-usable panel for searching and selecting posts
	 *
	 * @option search_args Parameters for post searching
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.PostPanel = wp.Backbone.View.extend({
		template: wp.template( 'clc-secondary-panel-post-selection' ),

		className: 'clc-post-panel',

		events: {
			'keyup .clc-search-input': 'keyupSearch',
		},

		initialize: function( options ) {
			_.extend( this, _.pick( options, 'search_args' ) );

			this.state = 'waiting';

			if ( typeof this.search_args == 'undefined' ) {
				this.search_args = {};
			}
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			this.updateState();
			this.search_input = this.$el.find( '.clc-search-input' );
			this.list = this.$el.find( '.clc-results-list' );
			this.renderCollection();
		},

		/**
		 * Render collection of posts
		 *
		 * @since 0.1
		 */
		renderCollection: function() {
			this.list.empty();
			this.collection.each( function( model ) {
				this.list.append( new clc.Views.PostSummary( { model: model, parent: this } ).render().el );
			}, this );
		},

		/**
		 * Respond to typing in the search field
		 *
		 * @since 0.1
		 */
		keyupSearch: function( event ) {
			event.preventDefault();

			var search = this.search_input.val();
			if ( search.length < 3 ) {
				this.resetSearch();
				return;
			}

			if ( this.search == search ) {
				return;
			}

			this.fetchPosts( search );
		},

		/**
		 * Reset the currently searched string
		 *
		 * @since 0.1
		 */
		resetSearch: function() {
			this.search = '';
			this.updatePosts([]);
			this.updateState( 'waiting' );
		},

		/**
		 * Fetch a list of posts
		 *
		 * @since 0.1
		 */
		fetchPosts: function( search ) {
			this.search = search.replace( /\s+/g, '+' );
			this.updateState( 'fetching' );

			this.search_args.s = this.search;

			$.ajax({
				url: CLC_Control_Settings.root + '/content-layout-control/v1/posts/',
				type: 'POST',
				data: this.search_args,
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', CLC_Control_Settings.nonce );
				},
				complete: _.bind( this.handleResponse, this )
			});
		},

		/**
		 * Handle response from search query
		 *
		 * @since 0.1
		 */
		handleResponse: function( response ) {
			if ( typeof response === 'undefined' || response.status !== 200 ) {
				return;
			}

			var data = response.responseJSON;
			if ( typeof data.s === 'undefined' || data.s != this.search ) {
				return;
			}

			this.updateState( 'waiting' );
			this.updatePosts( data.posts );
		},

		/**
		 * Update view state
		 *
		 * @since 0.1
		 */
		updateState: function( state ) {
			if ( state ) {
				this.state = state;
			}

			this.$el.removeClass( 'waiting fetching' );
			this.$el.addClass( this.state );
		},

		/**
		 * Update the collection of s
		 *
		 * @since 0.1
		 */
		updatePosts: function( posts ) {
			this.collection.reset( posts );
			this.renderCollection();
		},

		/**
		 * Select a post
		 *
		 * @since 0.1
		 */
		select: function( model ) {
			clc.secondary_panel.send( 'post-panel-add-post.clc', model.attributes );
			clc.secondary_panel.close();
		}
	});

	/**
	 * Post selection view
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.PostSummary = wp.Backbone.View.extend({
		tagName: 'li',

		template: wp.template( 'clc-secondary-panel-post-summary' ),

		events: {
			'click': 'select',
		},

		initialize: function( options ) {
			_.extend( this, _.pick( options, 'parent' ) );
		},

		/**
		 * Select this post
		 *
		 * @since 0.1
		 */
		select: function() {
			this.parent.select( this.model );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl || {};

	/**
	 * Re-usable panel for selecting and configuring links
	 *
	 * @option component The component view which opened the panel
	 * @option search_args @TODO search parameters for getting links from existing content
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.LinkPanel = wp.Backbone.View.extend({
		template: wp.template( 'clc-secondary-panel-link-selection' ),

		className: 'clc-link-panel',

		events: {
			'keyup .clc-link-panel-url': 'setButtonState',
			'keyup .clc-link-panel-link-text': 'setButtonState',
			'click .add-link': 'add',
			'click .search-content-link': 'openSearch',
			'click .back-to-search-form': 'closeSearch',
		},

		initialize: function( options ) {
			// Store reference to component
			_.extend( this, _.pick( options, 'component' ) );

			this.views.set( '.clc-link-panel-search-form', new clc.Views.LinkPanelPostSearch({ parent: this, collection: new Backbone.Collection() }) );
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			this.url = this.$el.find( '.clc-link-panel-url' );
			this.link_text = this.$el.find( '.clc-link-panel-link-text' );
			this.add_link = this.$el.find( '.add-link' );

			this.setButtonState();
		},

		/**
		 * Open the search view
		 *
		 * @since 0.1
		 */
		openSearch: function( event ) {
			event.preventDefault();
			this.$el.addClass( 'search-visible' );
			this.views.first( '.clc-link-panel-search-form' ).$el
				.find( 'input' ).focus();
		},

		/**
		 * Close the search window
		 *
		 * @since 0.1
		 */
		closeSearch: function( event ) {
			if ( typeof event !== 'undefined' ) {
				event.preventDefault();
			}

			this.$el.removeClass( 'search-visible' );
			this.add_link.focus();
		},

		/**
		 * Update link details
		 *
		 * @since 0.1
		 */
		updateLink: function( model ) {
			this.url.val( model.get( 'permalink' ) );
			this.link_text.val( model.get( 'title' ) );
			this.setButtonState();
			this.closeSearch();
		},

		/**
		 * Enable/disable the add link button
		 *
		 * @since 0.1
		 */
		setButtonState: function() {
			if ( this.isLinkValid() ) {
				this.add_link.removeAttr( 'disabled' );
			} else {
				this.add_link.attr( 'disabled', 'disabled' );
			}
		},

		/**
		 * Check if details about the link are sufficient
		 *
		 * @since 0.1
		 */
		isLinkValid: function() {
			return this.url.val() && this.link_text.val();
		},

		/**
		 * Add a link to the component
		 *
		 * @since 0.1
		 */
		add: function() {
			if ( !this.isLinkValid ) {
				return;
			}

			clc.secondary_panel.send(
				'link-panel-add-link.clc',
				{
					url: this.url.val(),
					link_text: this.link_text.val()
				}
			);

			clc.secondary_panel.close();
		}
	});

	/**
	 * Search panel for finding links to existing content
	 *
	 * @option parent The link panel view which opened the panel
	 * @augments clc.Views.PostPanel
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.LinkPanelPostSearch = clc.Views.PostPanel.extend({

		initialize: function( options ) {
			_.extend( this, _.pick( options, 'parent', 'search_args' ) );

			this.state = 'waiting';

			if ( typeof this.search_args == 'undefined' ) {
				this.search_args = {
					return: {
						title: 'title',
						description: 'post_type_label',
						permalink: 'permalink',
					},
				};
			}
		},

		/**
		 * Select a post and pass the model to the link panel
		 *
		 * @since 0.1
		 */
		select: function( model ) {
			this.parent.updateLink( model );
		}
	});

	/**
	 * Link selection view when looking up a post
	 *
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.LinkPostSummary = clc.Views.PostSummary.extend({
		/**
		 * Select this link
		 *
		 * @since 0.1
		 */
		select: function() {
			this.link_panel_view.trigger( 'link-panel-select-link.clc', this.model );
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
	 * View class for the Content Block form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['content-block'] = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-content-block' ),

		className: 'clc-component-content-block',

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'keyup [data-clc-setting-link]': 'updateTextLive',
			'reordered': 'reordered',
			'click .select-image': 'openMedia',
			'click input[name^="image_position"]': 'updateImagePosition',
			'click .remove-image': 'removeImage',
			'click .add-link': 'toggleLinkPanel',
			'click .remove-link': 'removeLink',
		},

		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control', 'is_open' ) );

			// Preserves expanded/collapsed state as the user browses around
			this.setDisplayClass();

			this.listenTo(this.model, 'change', this.componentChanged);
			this.listenTo(this.model, 'focus', this.focus);
			this.listenTo(this, 'link-panel-add-link.clc', this.addLink );
			this.listenTo(this, 'secondary-panel-closed.clc', this.secondaryPanelClosed );
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			if ( this.image_thumb_url && this.model.get( 'image' ) ) {
				this.renderThumb();
			// Fetch the thumbnail URL from the server if we don't yet have one
			} else if ( this.model.get( 'image' ) ) {
				$.ajax({
					url: CLC_Control_Settings.root + '/content-layout-control/v1/components/content-block/thumb-url/' + parseInt( this.model.get( 'image' ), 10 ),
					type: 'GET',
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', CLC_Control_Settings.nonce );
					},
					complete: _.bind( function( r ) {
						var url = '';
						if ( typeof r.success !== 'undefined' && r.success() && typeof r.responseJSON !== 'undefined' ) {
							url = r.responseJSON;
						}

						this.image_thumb_url = url;
						this.renderThumb();
					}, this )
				});
			}
		},

		/**
		 * Update the setting and set the title, but don't automatically
		 * trigger a re-render. The image update is handled manually.
		 *
		 * @since 0.1
		 */
		componentChanged: function( model ) {
			this.control.updateSetting();
			this.$el.find( '.header .title' ).text( model.get( 'title' ) );
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
				states: [
					new wp.media.controller.Library({
						title: 'Title Test',
						library: wp.media.query({ type: 'image' }),
						multiple: false,
						date: false,
					})
				]
			});

			this.media.on( 'select', _.bind( this.selectImage, this ) );
		},

		/**
		 * Receive the selected image from the media modal and assign it to
		 * the control
		 *
		 * @since 0.1
		 */
		selectImage: function() {
			var attachment = this.media.state().get( 'selection' ).first().toJSON();

			if ( attachment.id == this.model.get( 'image' ) ) {
				return;
			}

			this.model.set({ image: attachment.id });
			this.image_thumb_url = this.getThumbUrl( attachment.sizes );
			this.render();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
		},

		/**
		 * Retrieve a thumbnail URL when passed an array of available image
		 * sizes
		 *
		 * Selects `medium` if it exists and is large enough. Falls back to
		 * `full` otherwise.
		 *
		 * @since 0.1
		 */
		getThumbUrl: function( sizes ) {
			var size;
			if ( typeof sizes.medium !== 'undefined' && sizes.medium.width >= 238 ) {
				size = sizes.medium;
			} else if ( typeof sizes.full !== 'undefined' ) {
				size = sizes.full;
			}

			if ( !size ) {
				return '';
			}

			return size.url;
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
		renderThumb: function() {
			this.$el.find( '.thumb' ).removeClass( 'loading' )
				.html( '<img src="' + this.image_thumb_url + '">' );
		},

		/**
		 * Update the image position when selected
		 *
		 * @since 0.1
		 */
		updateImagePosition: function( event ) {
			var val = $( event.target ).val();

			wp.customize.previewer.send(
				'component-setting-changed-' + this.model.get( 'id' ) + '.clc',
				{
					setting: 'image-position',
					val: val
				}
			);
			this.model.set({ image_position: val });
		},

		/**
		 * Remove the image and reset to defaults
		 *
		 * @since 0.1
		 */
		removeImage: function( event ) {
			event.preventDefault();

			this.model.set({
				image: 0,
				image_position: 'left'
			});
			this.render();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
		},

		/**
		 * Create a new link panel and store a reference to the view
		 *
		 * @since 0.1
		 */
		createLinkPanelView: function() {
			this.link_panel_view = this.control.createLinkPanelView();
			return this.link_panel_view;
		},

		/**
		 * Open or close the link panel
		 *
		 * @since 0.1
		 */
		toggleLinkPanel: function( event ) {
			event.preventDefault();

			if ( !this.$el.hasClass( 'clc-links-panel-open' ) ) {
				this.openLinkPanel();
			} else {
				this.closeLinkPanel();
			}

		},

		/**
		 * Open the link panel
		 *
		 * @since 0.1
		 */
		openLinkPanel: function() {
			clc.secondary_panel.trigger( 'load-secondary-panel.clc', this.createLinkPanelView(), this );
			this.$el.addClass( 'clc-links-panel-open' );
		},

		/**
		 * Close the link panel
		 *
		 * @since 0.1
		 */
		closeLinkPanel: function() {
			clc.secondary_panel.trigger( 'close-secondary-panel.clc' );
		},

		/**
		 * React to the secondary panel being closed
		 *
		 * @since 0.1
		 */
		secondaryPanelClosed: function( view ) {
			if ( view.cid === this.link_panel_view.cid ) {
				this.$el.removeClass( 'clc-links-panel-open' );
				this.$el.find( '.add-link' ).focus();
			}
		},

		/**
		 * Add a link
		 *
		 * @since 0.1
		 */
		addLink: function( link ) {
			this.model.get( 'links' ).push( link );
			this.control.updateSetting();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
			this.render();
		},

		/**
		 * Remove a link
		 *
		 * @since 0.1
		 */
		removeLink: function( event ) {
			this.model.get( 'links' ).splice( $( event.target ).data( 'index' ), 1 );
			this.control.updateSetting();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
			this.render();
		}

	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Content Block form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls['content-block-two'] = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-content-block' ),

		className: 'clc-component-content-block',

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'blur [data-clc-setting-link]': 'updateLinkedSetting',
			'keyup [data-clc-setting-link]': 'updateTextLive',
			'reordered': 'reordered',
			'click .select-image': 'openMedia',
			'click input[name^="image_position"]': 'updateImagePosition',
			'click .remove-image': 'removeImage',
			'click .add-link': 'toggleLinkPanel',
			'click .remove-link': 'removeLink',
		},

		initialize: function( options ) {
			// Store reference to control
			_.extend( this, _.pick( options, 'control', 'is_open' ) );

			// Preserves expanded/collapsed state as the user browses around
			this.setDisplayClass();

			this.listenTo(this.model, 'change', this.componentChanged);
			this.listenTo(this.model, 'focus', this.focus);
			this.listenTo(this, 'link-panel-add-link.clc', this.addLink );
			this.listenTo(this, 'secondary-panel-closed.clc', this.secondaryPanelClosed );
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this );

			if ( this.image_thumb_url && this.model.get( 'image' ) ) {
				this.renderThumb();
			// Fetch the thumbnail URL from the server if we don't yet have one
			} else if ( this.model.get( 'image' ) ) {
				$.ajax({
					url: CLC_Control_Settings.root + '/content-layout-control/v1/components/content-block-two/thumb-url/' + parseInt( this.model.get( 'image' ), 10 ),
					type: 'GET',
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', CLC_Control_Settings.nonce );
					},
					complete: _.bind( function( r ) {
						var url = '';
						if ( typeof r.success !== 'undefined' && r.success() && typeof r.responseJSON !== 'undefined' ) {
							url = r.responseJSON;
						}

						this.image_thumb_url = url;
						this.renderThumb();
					}, this )
				});
			}
		},

		/**
		 * Update the setting and set the title, but don't automatically
		 * trigger a re-render. The image update is handled manually.
		 *
		 * @since 0.1
		 */
		componentChanged: function( model ) {
			this.control.updateSetting();
			this.$el.find( '.header .title' ).text( model.get( 'title' ) );
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
				states: [
					new wp.media.controller.Library({
						title: 'Title Test',
						library: wp.media.query({ type: 'image' }),
						multiple: false,
						date: false,
					})
				]
			});

			this.media.on( 'select', _.bind( this.selectImage, this ) );
		},

		/**
		 * Receive the selected image from the media modal and assign it to
		 * the control
		 *
		 * @since 0.1
		 */
		selectImage: function() {
			var attachment = this.media.state().get( 'selection' ).first().toJSON();

			if ( attachment.id == this.model.get( 'image' ) ) {
				return;
			}

			this.model.set({ image: attachment.id });
			this.image_thumb_url = this.getThumbUrl( attachment.sizes );
			this.render();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
		},

		/**
		 * Retrieve a thumbnail URL when passed an array of available image
		 * sizes
		 *
		 * Selects `medium` if it exists and is large enough. Falls back to
		 * `full` otherwise.
		 *
		 * @since 0.1
		 */
		getThumbUrl: function( sizes ) {
			var size;
			if ( typeof sizes.medium !== 'undefined' && sizes.medium.width >= 238 ) {
				size = sizes.medium;
			} else if ( typeof sizes.full !== 'undefined' ) {
				size = sizes.full;
			}

			if ( !size ) {
				return '';
			}

			return size.url;
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
		renderThumb: function() {
			this.$el.find( '.thumb' ).removeClass( 'loading' )
				.html( '<img src="' + this.image_thumb_url + '">' );
		},

		/**
		 * Update the image position when selected
		 *
		 * @since 0.1
		 */
		updateImagePosition: function( event ) {
			var val = $( event.target ).val();

			wp.customize.previewer.send(
				'component-setting-changed-' + this.model.get( 'id' ) + '.clc',
				{
					setting: 'image-position',
					val: val
				}
			);
			this.model.set({ image_position: val });
		},

		/**
		 * Remove the image and reset to defaults
		 *
		 * @since 0.1
		 */
		removeImage: function( event ) {
			event.preventDefault();

			this.model.set({
				image: 0,
				image_position: 'left'
			});
			this.render();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
		},

		/**
		 * Create a new link panel and store a reference to the view
		 *
		 * @since 0.1
		 */
		createLinkPanelView: function() {
			this.link_panel_view = this.control.createLinkPanelView();
			return this.link_panel_view;
		},

		/**
		 * Open or close the link panel
		 *
		 * @since 0.1
		 */
		toggleLinkPanel: function( event ) {
			event.preventDefault();

			if ( !this.$el.hasClass( 'clc-links-panel-open' ) ) {
				this.openLinkPanel();
			} else {
				this.closeLinkPanel();
			}

		},

		/**
		 * Open the link panel
		 *
		 * @since 0.1
		 */
		openLinkPanel: function() {
			clc.secondary_panel.trigger( 'load-secondary-panel.clc', this.createLinkPanelView(), this );
			this.$el.addClass( 'clc-links-panel-open' );
		},

		/**
		 * Close the link panel
		 *
		 * @since 0.1
		 */
		closeLinkPanel: function() {
			clc.secondary_panel.trigger( 'close-secondary-panel.clc' );
		},

		/**
		 * React to the secondary panel being closed
		 *
		 * @since 0.1
		 */
		secondaryPanelClosed: function( view ) {
			if ( view.cid === this.link_panel_view.cid ) {
				this.$el.removeClass( 'clc-links-panel-open' );
				this.$el.find( '.add-link' ).focus();
			}
		},

		/**
		 * Add a link
		 *
		 * @since 0.1
		 */
		addLink: function( link ) {
			this.model.get( 'links' ).push( link );
			this.control.updateSetting();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
			this.render();
		},

		/**
		 * Remove a link
		 *
		 * @since 0.1
		 */
		removeLink: function( event ) {
			this.model.get( 'links' ).splice( $( event.target ).data( 'index' ), 1 );
			this.control.updateSetting();
			wp.customize.previewer.send( 'component-changed.clc', this.model );
			this.render();
		}

	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Posts form
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentForm
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_controls.posts = clc.Views.BaseComponentForm.extend({
		template: wp.template( 'clc-component-posts' ),

		className: 'clc-component-posts',

		events: {
			'click .clc-toggle-component-form': 'toggleDisplay',
			'click .delete': 'delete',
			'reordered': 'reordered',
			'click .add-post': 'togglePostPanel',
			'click .remove-post': 'removePost',
		},

		initialize: function( options ) {
			_.extend( this, _.pick( options, 'control', 'is_open' ) );

			// Preserves expanded/collapsed state as the user browses around
			this.setDisplayClass();

			this.listenTo(this.model, 'change', this.componentChanged);
			this.listenTo(this.model, 'focus', this.focus);
			this.listenTo(this, 'post-panel-add-post.clc', this.addPost );
			this.listenTo(this, 'secondary-panel-closed.clc', this.secondaryPanelClosed );

			if ( this.model.get( 'items' ).length ) {
				this.fetchPostDetails();
			}
		},

		/**
		 * Retrieve search arguments for post lookup
		 *
		 * @since 0.1
		 */
		getSearchArgs: function( search_args ) {
			return { post_type: this.model.get( 'post_types' ) };
		},

		/**
		 * Create a new post panel and store a reference to the view
		 *
		 * @since 0.1
		 */
		createPostPanelView: function( options ) {
			this.post_panel_view = this.control.createPostPanelView( { search_args: this.getSearchArgs() } );
			return this.post_panel_view;
		},

		/**
		 * Open or close the post panel
		 *
		 * @since 0.1
		 */
		togglePostPanel: function( event ) {
			event.preventDefault();

			if ( !this.$el.hasClass( 'clc-posts-panel-open' ) ) {
				this.openLinkPanel();
			} else {
				this.closeLinkPanel();
			}

		},

		/**
		 * Open the post panel
		 *
		 * @since 0.1
		 */
		openLinkPanel: function() {
			clc.secondary_panel.trigger( 'load-secondary-panel.clc', this.createPostPanelView(), this );
			this.$el.addClass( 'clc-posts-panel-open' );
		},

		/**
		 * Close the post panel
		 *
		 * @since 0.1
		 */
		closeLinkPanel: function() {
			clc.secondary_panel.trigger( 'close-secondary-panel.clc' );
		},

		/**
		 * React to the secondary panel being closed
		 *
		 * @since 0.1
		 */
		secondaryPanelClosed: function( view ) {
			if ( view.cid === this.post_panel_view.cid ) {
				this.$el.removeClass( 'clc-posts-panel-open' );
				this.$el.find( '.add-post' ).focus();
			}
		},

		/**
		 * Add a post
		 *
		 * @since 0.1
		 */
		addPost: function( post ) {
			this.model.get( 'items' ).push( post );
			this.control.updateSetting();
			this.model.trigger( 'change', this.model );
			this.render();
		},

		/**
		 * Remove a post
		 *
		 * @since 0.1
		 */
		removePost: function( event ) {
			this.model.get( 'items' ).splice( $( event.target ).data( 'index' ), 1 );
			this.control.updateSetting();
			this.model.trigger( 'change', this.model );
			this.render();
		},

		/**
		 * Fetch post display details
		 *
		 * Used when loading the stored values from the database, which will
		 * only include an array of post IDs.
		 *
		 * @since 0.1
		 */
		fetchPostDetails: function() {

			for( var i in this.model.get( 'items' ) ) {
				var data = _.extend( this.getSearchArgs(), { ID: this.model.get( 'items' )[i].ID } );
				$.ajax({
					url: CLC_Control_Settings.root + '/content-layout-control/v1/posts/',
					type: 'POST',
					data: data,
					beforeSend: clc.Functions.getRequestHeader,
					complete: _.bind( this.fetchPostDetailsResponse, this )
				});
			}
		},

		/**
		 * Handle response from request to fetch post details
		 *
		 * @since 0.1
		 */
		fetchPostDetailsResponse: function( response ) {
			if ( typeof response === 'undefined' || response.status !== 200 ) {
				return;
			}

			var data = response.responseJSON;
			if ( typeof data.ID === 'undefined' ) {
				return;
			}

			var posts = this.model.get( 'items' );
			for ( var i in posts ) {
				if ( posts[i].ID == data.ID ) {
					posts[i] = data.posts;
					break;
				}
			}

			this.model.set( { items: posts } );

			this.render();
		},

	});

} )( jQuery );
