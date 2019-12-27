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
	 * Model class for the Components Content Block component
	 *
	 * @augments Backbone.Model
	 * @since 1.0.0
	 */
	clc.Models.components['classic-content-block'] = clc.Models.components['content-block'].extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'classic-content-block',
				image:          0,
				image_position: 'left',
				title_line_one: '',
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
	 * Model class for the Components Content Block component
	 *
	 * @augments Backbone.Model
	 * @since 1.0.0
	 */
	clc.Models.components['classic-content-block-two'] = clc.Models.components['content-block'].extend({
		defaults: function() {
			return {
				name:           '',
				description:    '',
				type:           'classic-content-block-two',
				image:          0,
				image_position: 'left',
				title_line_one: '',
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
	 * Model class for the Components Hero Block component
	 *
	 * @augments clc.Models.components['content-block']
	 * @augments Backbone.Model
	 * @since 1.0.0
	 */
	clc.Models.components['classic-hero-block'] = clc.Models.components['content-block'].extend({
		defaults: function() {
			return {
				name:               '',
				description:        '',
				type:               'classic-hero-block',
				image:              0,
				image_transparency: 0,
				title_line_one:     '',
				title:              '',
				links:              [],
				contact:            '',
				order:              0
			};
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * Model class for the Components Hero Block component
	 *
	 * @augments clc.Models.components['content-block']
	 * @augments Backbone.Model
	 * @since 1.0.0
	 */
	clc.Models.components['classic-cta-banner'] = clc.Models.components['content-block'].extend({
		defaults: function() {
			return {
				name:               '',
				description:        '',
				type:               'classic-cta-banner',
				image:              0,
				image_transparency: 0,
				title_line_one:     '',
				title:              '',
				links:              [],
				order:              0
			};
		}
	});

} )( jQuery );


( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Gallery layout
	 *
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentPreview
	 * @augments wp.Backbone.View
	 * @since 0.1
	 */
	clc.Views.component_previews.gallery = clc.Views.BaseComponentPreview.extend();

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Content Block layout
	 *
	 * @augments clc.Views.component_previews['content-block']
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentPreview
	 * @augments wp.Backbone.View
	 * @since 1.0.0
	 */
	clc.Views.component_previews['classic-content-block'] = clc.Views.component_previews['content-block'].extend({
		/**
		 * Handle individual settings updates
		 *
		 * @since 1.0.0
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'title' ) {
				this.$el.find( '.' + data.setting ).html( this.wrapFirstWord( data.val ) );
			} else if ( data.setting == 'image-position' ) {
				this.updateImagePosition( data.val );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Wrap the first word of a string in a span for styling
		 *
		 * @since 1.0.0
		 */
		wrapFirstWord: function( string ) {
			string = string.split( ' ' );
			var first = string.splice( 0, 1 );
			return '<span class="classic-first-word">' + first[0] + '</span>' + string.join( ' ' );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Content Block Two layout
	 *
	 * @augments clc.Views.component_previews['content-block']
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentPreview
	 * @augments wp.Backbone.View
	 * @since 1.0.0
	 */
	clc.Views.component_previews['classic-content-block-two'] = clc.Views.component_previews['content-block'].extend({
		/**
		 * Handle individual settings updates
		 *
		 * @since 1.0.0
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'title' ) {
				this.$el.find( '.' + data.setting ).html( this.wrapFirstWord( data.val ) );
			} else if ( data.setting == 'image-position' ) {
				this.updateImagePosition( data.val );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Wrap the first word of a string in a span for styling
		 *
		 * @since 1.0.0
		 */
		wrapFirstWord: function( string ) {
			string = string.split( ' ' );
			var first = string.splice( 0, 1 );
			return '<span class="classic-first-word">' + first[0] + '</span>' + string.join( ' ' );
		}
	});

} )( jQuery );

( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the Hero Block layout
	 *
	 * @augments clc.Views.component_previews['components-content-block']
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentPreview
	 * @augments wp.Backbone.View
	 * @since 1.0.0
	 */
	clc.Views.component_previews['classic-hero-block'] = clc.Views.component_previews['classic-content-block'].extend({
		/**
		 * Handle individual settings updates
		 *
		 * @since 1.0.0
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'image_transparency' ) {
				this.updateBackgroundTransparency( data.val );
			} else if ( data.setting == 'title' ) {
				this.$el.find( '.' + data.setting ).html( this.wrapFirstWord( data.val ) );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Update the background image transparency
		 *
		 * @since 1.0.0
		 */
		updateBackgroundTransparency: function( val ) {
			var bg = this.$el.find( '.background' );
			if ( !bg.length ) {
				return;
			}

			val = 100 - parseInt( val, 10 );
			if ( val === 0 ) {
				bg.css( 'opacity', 0 );
			} else {
				bg.css( 'opacity', val / 100 );
			}
		}

	});

} )( jQuery );


( function( $ ) {

	var clc = wp.customize.ContentLayoutControl;

	/**
	 * View class for the CTA Banner Block layout
	 *
	 * @augments clc.Views.component_previews['components-content-block']
	 * @augments wp.customize.ContentLayoutControl.Views.BaseComponentPreview
	 * @augments wp.Backbone.View
	 * @since 1.0.0
	 */
	clc.Views.component_previews['classic-cta-banner'] = clc.Views.component_previews['classic-content-block'].extend({
		/**
		 * Handle individual settings updates
		 *
		 * @since 1.0.0
		 */
		settingChanged: function( data ) {
			if ( data.setting == 'image_transparency' ) {
				this.updateBackgroundTransparency( data.val );
			} else if ( data.setting == 'title' ) {
				this.$el.find( '.' + data.setting ).html( this.wrapFirstWord( data.val ) );
			} else {
				this.$el.find( '.' + data.setting ).html( data.val );
			}
		},

		/**
		 * Update the background image transparency
		 *
		 * @since 1.0.0
		 */
		updateBackgroundTransparency: function( val ) {
			var bg = this.$el.find( '.background' );
			if ( !bg.length ) {
				return;
			}

			val = 100 - parseInt( val, 10 );
			if ( val === 0 ) {
				bg.css( 'opacity', 0 );
			} else {
				bg.css( 'opacity', val / 100 );
			}
		}

	});

} )( jQuery );