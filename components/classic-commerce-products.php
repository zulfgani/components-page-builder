<?php defined( 'ABSPATH' ) || exit;
/**
 * Map component
 *
 * @since 0.1
 */
class Classic_Commerce_Products extends CLC_Component {

	/**
	 * Type of component
	 *
	 * @param string
	 * @since 0.1
	 */
	public $type = 'classic-commerce-products';
	
	/**
	 * Number of products to display
	 *
	 * @param int
	 * @since 0.1
	 */
	public $number = 3;
	
	/**
	 * Columns Layout
	 *
	 * @param int
	 * @since 0.1
	 */
	public $columns = 3;
	
	public $limit_columns = 4;

	/**
	 * Post types to allow
	 *
	 * @since 0.1
	 */
	public $post_types = 'products';
	
	public $title = '';
	
	public $selector_id = '';
	
	/**
	 * Maximum number of posts allowed
	 *
	 * @param int
	 * @since 0.1
	 */
	public $limit_products = 10;

	/**
	 * Settings expected by this component
	 *
	 * @param array Setting keys
	 * @since 0.1
	 */
	public $settings = array( 
		'number', 
		'title', 
		'columns', 
	);

	/**
	 * Sanitize settings
	 *
	 * @param array val Values to be sanitized
	 * @return array
	 * @since 0.1
	 */
	public function sanitize( $val ) {

		return [
			'title'          => isset( $val['title'] ) ? sanitize_text_field( $val['title'] ) : '',
			'number'         => isset( $val['number'] ) ? absint( $val['number'] ) : $this->number,
			'columns'        => isset( $val['columns'] ) ? absint( $val['columns'] ) : $this->columns,
			'selector_id'    => isset( $val['selector_id'] ) ? sanitize_text_field( $val['selector_id'] ) : $this->selector_id,
			'type'           => $this->type, // Don't allow this to be modified
		];
	}
	
	public function render_layout() {
		global $post;
		$number = ( ! empty( $this->number ) ) ? absint( $this->number ) : 3;
		if ( ! $number )
			$number = 3;
		$columns = ( ! empty( $this->columns ) ) ? absint( $this->columns ) : 3;
		if ( ! $columns )
			$columns = 3;
		
		if( class_exists( 'WooCommerce' ) ) {
			echo '<div id="' . esc_attr( $this->selector_id ) . '" class="clc-wrapper clc-classic-commerce-products">';
				echo '<h2 class="title">' . esc_html( $this->title ). '</h2>';
				echo do_shortcode( 
					'[products limit="' . absint($number) . '" columns="' . absint( $columns ) . '" ]'
				);				
			echo '</div>';
		}
	}

	/** /components/templates/
	 * Print the control template. It should be an Underscore.js template
	 * using the same template conventions as core ClassicPress controls
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
		
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['title']; ?></span>
				<input type="text" value="{{ data.model.get( 'title' ) }}" data-clc-setting-link="title">
			</label>
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['number_label']; ?></span>
				<select data-clc-setting-link="number">
					<# for ( var i = 1; i <= data.model.get( 'limit_products' ); i++ ) { #>
						<option value="{{ i }}"<# if ( i === data.model.get( 'number' ) ) { #> selected<# } #>>{{ i }}</option>
					<# } #>
				</select>
			</label>
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['columns_label']; ?></span>
				<select data-clc-setting-link="columns">
					<# for ( var i = 1; i <= data.model.get( 'limit_columns' ); i++ ) { #>
						<option value="{{ i }}"<# if ( i === data.model.get( 'columns' ) ) { #> selected<# } #>>{{ i }}</option>
					<# } #>
				</select>
			</label>
			
		</div>
		<div class="footer">
			<a href="#" class="delete"><?php esc_html_e( CLC_Content_Layout_Control::$i18n['delete'] ); ?></a>
		</div>
		<?php
	}
	
	/**
	 * Get meta attributes
	 *
	 * @since 0.1
	 */
	public function get_meta_attributes() {

		$atts = parent::get_meta_attributes();
		$atts['limit_products'] = $this->limit_products;
		$atts['limit_columns'] = $this->limit_columns;

		return $atts;
	}
}
