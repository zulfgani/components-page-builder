<?php if ( ! defined( 'ABSPATH' ) ) exit;
if ( !class_exists( 'CLC_Component_Gallery' ) ) {
	/**
	 * Image gallery layout component
	 *
	 * @since 0.1
	 */
	class CLC_Component_Gallery extends CLC_Component {

		/**
		 * Type of component
		 *
		 * @param string
		 * @since 0.1
		 */
		public $type = 'gallery';
		
		/**
		 * Title to accompany the list
		 *
		 * @param string
		 * @since 0.1
		 */
		public $title = '';

		/**
		 * Images (attachment IDs)
		 *
		 * @param array
		 * @since 0.1
		 */
		public $images = array();

		/**
		 * Columns (gallery shortcode columns attribute)
		 *
		 * @param int
		 * @since 0.1
		 */
		public $columns = 5;

		/**
		 * Image size to use for thumbnails
		 *
		 * @param string
		 * @since 0.1
		 */
		public $size = 'medium';
		
		public $selector_id = '';

		/**
		 * Settings expected by this component
		 *
		 * @param array Setting keys
		 * @since 0.1
		 */
		public $settings = array( 
			'title', 
			'images', 
			'columns', 
			'size', 
			'selector_id' 
		);

		/**
		 * Sanitize settings
		 *
		 * @param array val Values to be sanitized
		 * @return array
		 * @since 0.1
		 */
		public function sanitize( $val ) {

			return array(
				'id'             => isset( $val['id'] ) ? absint( $val['id'] ) : 0,
				'title'          => isset( $val['title'] ) ? sanitize_text_field( $val['title'] ) : '',
				'images'         => isset( $val['images'] ) ? array_map( 'absint', $val['images'] ) : $this->images,
				'columns'        => isset( $val['columns'] ) ? absint( $val['columns'] ) : $this->columns,
				'size'           => isset( $val['size'] ) ? sanitize_text_field( $val['size'] ) : 'medium',
				'order'          => isset( $val['order'] ) ? absint( $val['order'] ) : 0,
				'selector_id'    => isset( $val['selector_id'] ) ? sanitize_text_field( $val['selector_id'] ) : $this->selector_id,
				'type'           => $this->type, // Don't allow this to be modified
			);
		}

		/**
		 * Register custom endpoint to transform image IDs into thumb URLs
		 *
		 * @since 0.1
		 */
		public function register_endpoints() {
			register_rest_route(
				'content-layout-control/v1',
				'/components/gallery/thumb-urls/(?P<ids>.+)',
				array(
					'methods'   => 'GET',
					'callback' => array( $this, 'api_get_thumb_urls' ),
					'permission_callback' => array( CLC_Content_Layout_Control(), 'current_user_can' ),
				)
			);
		}

		/**
		 * API endpoint: transform an image ID into the thumbnail URL
		 *
		 * @since 0.1
		 */
		public function api_get_thumb_urls( WP_REST_Request $request ) {

			if ( !isset( $request['ids'] ) ) {
				return '';
			}

			$ids = explode( ',', $request['ids'] );
			$urls = array();
			foreach( $ids as $id ) {
				$img = wp_get_attachment_image_src( absint( $id ), 'medium' );
				$urls[] = is_array( $img ) ? $img[0] : '';
			}

			return $urls;
		}
		
		public function render_layout() {
			
			echo '<div id="' . esc_attr( $this->selector_id ) . '" class="clc-wrapper clc-gallery">';
				echo '<h2 class="title">' . esc_html( $this->title ). '</h2>';
				echo do_shortcode('[gallery link="file" ids="' . esc_attr( join( ',', $this->images ) ) . '" columns="' . absint( $this->columns ) . '" size="'. esc_attr( $this->size ) . '"]');				
			echo '</div>';
			
		}

		/** /components/templates/
		 * Print the control template. It should be an Underscore.js template
		 * using the same template conventions as core WordPress controls
		 *
		 * @since 0.1
		 */
		public function control_template() {
			?>
			<div class="header">
				<h4 class="name">
					<?php esc_html_e( $this->name ); ?>
					<span class="title">{{ data.model.get( 'title' ) }}</span>
				</h4>
				<a href="#" class="clc-toggle-component-form"><?php esc_html_e( CLC_Content_Layout_Control::$i18n['control-toggle'] ); ?></a>
			</div>
			
			<div class="control">
				
				<div class="setting">
					<label>
						<span class="customize-control-title"><?php echo $this->i18n['title']; ?></span>
						<input type="text" value="{{ data.model.get( 'title' ) }}" data-clc-setting-link="title">
					</label>
			
					<span class="customize-control-title"><?php echo $this->i18n['image']; ?></span>
					<# if ( !data.model.get( 'images' ).length ) { #>
						<div class="placeholder">
							<?php echo $this->i18n['image_placeholder']; ?>
						</div>
					<# } else { #>
						<div class="thumb loading"></div>
					<# } #>
					<div class="buttons">
						<# if ( !data.model.get( 'images' ).length ) { #>
							<button class="select-image button-secondary">
								<?php echo $this->i18n['image_select_button']; ?>
							</button>
						<# } else { #>
							<button class="select-image button-secondary">
								<?php echo $this->i18n['image_change_button']; ?>
							</button>
						<# } #>
					</div>
				</div>
				<label>
					<span class="customize-control-title"><?php echo $this->i18n['columns_label']; ?></span>
					<select data-clc-setting-link="columns">
						<# for ( var i = 1; i <= data.model.get( 'columns' ); i++ ) { #>
							<option value="{{ i }}"<# if ( i === data.model.get( 'columns' ) ) { #> selected<# } #>>{{ i }}</option>
						<# } #>
					</select>
				</label>
				
				<label>
					<span class="customize-control-title"><?php echo $this->i18n['selector_id']; ?></span>
					<input type="text" value="{{ data.model.get( 'selector_id' ) }}" data-clc-setting-link="selector_id">
				</label>
				
			</div>
			
			<div class="footer">
				<a href="#" class="delete"><?php esc_html_e( CLC_Content_Layout_Control::$i18n['delete'] ); ?></a>
			</div>
		<?php
		}
	}
}
