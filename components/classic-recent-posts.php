<?php defined( 'ABSPATH' ) || exit;
/**
 * Recent Posts component
 *
 * @since 0.1
 */
class Classic_Component_RecentPosts extends CLC_Component {

	static $plugin_dir;
	/**
	 * Type of component
	 *
	 * @param string
	 * @since 0.1
	 */
	public $type = 'classic-recent-posts';

	/**
	 * Number of posts to display
	 *
	 * @param int
	 * @since 0.1
	 */
	public $number = 3;
	
	/**
	 * Title to accompany the list
	 *
	 * @param string
	 * @since 0.1
	 */
	public $title = '';

	/**
	 * Whether or not to show the date
	 *
	 * @param int
	 * @since 0.1
	 */
	public $show_date = 0;
	
	public $show_thumb = 1;
	
	public $show_readmore = 1;

	/**
	 * Maximum number of posts allowed
	 *
	 * @param int
	 * @since 0.1
	 */
	public $limit_posts = 10;
	
	public $excerpt_limit = '';
	
	/**
	 * Columns Layout
	 *
	 * @param int
	 * @since 0.1
	 */
	public $columns = 3;
	
	public $limit_columns = 4;
	/**
	 * Settings expected by this component
	 *
	 * @param array Setting keys
	 * @since 0.1
	 */
	public $settings = array( 
		'number', 
		'title', 
		'show_thumb',
		'show_date', 
		'show_readmore',
		'columns', 
		'excerpt_limit',
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
			'number'         => isset( $val['number'] ) ? absint( $val['number'] ) : $this->number,
			'title'          => isset( $val['title'] ) ? sanitize_text_field( $val['title'] ) : '',
			'columns'        => isset( $val['columns'] ) ? absint( $val['columns'] ) : $this->columns,
			'show_thumb'     => !empty( $val['show_thumb'] ) ? 1 : 0,
			'show_date'      => !empty( $val['show_date'] ) ? 1 : 0,
			'show_readmore'  => !empty( $val['show_readmore'] ) ? 1 : 0,
			'order'          => isset( $val['order'] ) ? absint( $val['order'] ) : 0,
			'excerpt_limit'  => isset( $val['excerpt_limit'] ) ? absint( $val['excerpt_limit'] ) : $this->excerpt_limit,
			'type'           => $this->type, // Don't allow this to be modified
		);
	}
	
	public function render_layout() { 
		$number = ( ! empty( $this->number ) ) ? absint( $this->number ) : 5;
		if ( ! $number )
			$number = 5;
		$show_thumb 	= !empty( $this->show_thumb ) ? '1' : '0';
		$show_date 		= !empty( $this->show_date ) ? '1' : '0';
		$show_readmore 	= !empty( $this->show_readmore ) ? '1' : '0';
		
		$excerpt_limit = ( !isset( $this->excerpt_limit ) ) ? absint( $this->excerpt_limit ) : $this->excerpt_limit;
		if ( ! $excerpt_limit )
			$excerpt_limit = 200;
		?>
			
			<div class="clc-wrapper clc-classic-recent-posts clc-classic-recent-posts columns-<?php echo absint( $this->columns ); ?>">
				<?php if ( !empty( $this->title ) ) { ?>
				<h2 class="title"><?php echo esc_html( $this->title ); ?></h2>
				<?php } ?>
				<div class="col-container">
					<?php include self::$plugin_dir . 'template-parts/query-posts.php'; ?>
				</div>
			</div>
			
		<?php
	}

	/** /components/templates/
	 * Print the control template. It should be an Underscore.js template
	 * using the same template conventions as core ClassicPress controls
	 *
	 * @since 0.1
	 */
	public function control_template() { ?>
	
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
					<# for ( var i = 1; i <= data.model.get( 'limit_posts' ); i++ ) { #>
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
			
			<label>
				<input type="checkbox" data-clc-show-date-link="true"<# if ( data.model.get( 'show_date' ) ) { #> checked="checked"<# } #>>
				<?php echo $this->i18n['show_date']; ?>
			</label>
			
			<label>
				<input type="checkbox" data-clc-show-thumb-link="true"<# if ( data.model.get( 'show_thumb' ) ) { #> checked="checked"<# } #>>
				<?php echo $this->i18n['thumb_label']; ?>
			</label>
			
			<label>
				<input type="checkbox" data-clc-show-readmore-link="true"<# if ( data.model.get( 'show_readmore' ) ) { #> checked="checked"<# } #>>
				<?php echo $this->i18n['readmore_label']; ?>
			</label>
			
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['excerpt_limit']; ?></span>
				<input type="text" value="{{ data.model.get( 'excerpt_limit' ) }}" data-clc-setting-link="excerpt_limit">
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
		$atts['show_date'] = $this->show_date;
		$atts['limit_posts'] = $this->limit_posts;
		$atts['limit_columns'] = $this->limit_columns;
		$atts['excerpt_limit'] = $this->excerpt_limit;

		return $atts;
	}
}
