<?php
/**
 * Plugin Name: Components Page Builder
 * Plugin URI: https://github.com/zulfgani/components-page-builder
 * Description: Beautiful page layouts for any ClassicPress theme that supports the builder.
 * Version: 1.0.0
 * Author: ClassicDesigner
 * Author URI: https://classicdesigner.co.uk
 * License:     GNU General Public License v2.0 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * GitHub URI: zulfgani/classic-homepage-builder
 *
 * Text Domain: components-page-builder
 * Domain Path: /languages/
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write
 * to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define( 'CHB_PLUS_VERSION', '1.0.0' );

define( 'CHB_PLUS__FILE__', __FILE__ );
define( 'CHB_PLUS_PLUGIN_BASE', plugin_basename( CHB_PLUS__FILE__ ) );
define( 'CHB_PLUS_URL', plugins_url( '/', CHB_PLUS__FILE__ ) );
define( 'CHB_PLUS_PATH', plugin_dir_path( CHB_PLUS__FILE__ ) );
define( 'CHB_PLUS_CORE_PATH', CHB_PLUS_PATH . 'core/' );
define( 'CHB_PLUS_INC_PATH', CHB_PLUS_PATH . 'inc/' );
define( 'CHB_PLUS_ASSETS_URL', CHB_PLUS_URL . 'assets/' );
define( 'CHB_PLUS_COMPONENTS_URL', CHB_PLUS_URL . 'components/' );
define( 'CHB_PLUS_COMPONENTS_PATH', CHB_PLUS_PATH . 'components/' );

/*dirname( __FILE__ ) */
include_once( CHB_PLUS_PATH . 'plugin.php' );
include_once( CHB_PLUS_INC_PATH . 'helper-functions.php' );

// Process updates from GitHub
// @see https://github.com/facetWP/github-updater-lite
include_once( CHB_PLUS_CORE_PATH . 'github-updater-lite/github-updater.php' );


function sc_editor_settings($settings) {
	$settings['quicktags'] = false;
	return $settings;
}
add_filter( 'wp_editor_settings', 'sc_editor_settings' );