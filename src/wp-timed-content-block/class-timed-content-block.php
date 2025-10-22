<?php
/**
 * Timed Content Block
 *
 * @package     Timed_Content_Block
 * @author      ByteSturm
 * @license     GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: Timed Content Block
 * Plugin URI:  https://github.com/ByteSturm/wp-timed-content-block
 * Description: A Gutenberg block that shows or hides content based on date and time settings.
 * Version:     1.0.0
 * Author:      ByteSturm
 * Author URI:  https://bytesturm.com
 * Text Domain: wp-timed-content-block
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Timed_Content_Block class
 */
class Timed_Content_Block {

    /**
     * Plugin version.
     *
     * @var string
     */
    const VERSION = '1.0.0';

    /**
     * The single instance of the class.
     *
     * @var Timed_Content_Block
     */
    protected static $instance = null;

    /**
     * Main Timed_Content_Block Instance.
     *
     * Ensures only one instance of Timed_Content_Block is loaded or can be loaded.
     *
     * @return Timed_Content_Block - Main instance.
     */
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor.
     */
    public function __construct() {
        $this->define_constants();
        $this->init_hooks();
    }

    /**
     * Define constants.
     */
    private function define_constants() {
        $this->define( 'TIMED_CONTENT_BLOCK_ABSPATH', dirname( __FILE__ ) . '/' );
        $this->define( 'TIMED_CONTENT_BLOCK_VERSION', self::VERSION );
    }

    /**
     * Define constant if not already set.
     *
     * @param string      $name  Constant name.
     * @param string|bool $value Constant value.
     */
    private function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }

    /**
     * Initialize hooks.
     */
    private function init_hooks() {
        // Register block
        add_action( 'init', array( $this, 'register_block' ) );
        
        // Enqueue block editor assets
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
        
        // Enqueue frontend assets
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
    }

    /**
     * Register block.
     */
    public function register_block() {
        // Register block script
        $asset_file = include( TIMED_CONTENT_BLOCK_ABSPATH . 'build/index.asset.php' );

        wp_register_script(
            'wp-timed-content-block-editor',
            plugins_url( 'build/index.js', __FILE__ ),
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );

        // Register block editor styles
        wp_register_style(
            'wp-timed-content-block-editor-style',
            plugins_url( 'build/index.css', __FILE__ ),
            array( 'wp-edit-blocks' ),
            filemtime( TIMED_CONTENT_BLOCK_ABSPATH . 'build/index.css' )
        );

        // Register block frontend styles
        wp_register_style(
            'wp-timed-content-block-style',
            plugins_url( 'build/style-index.css', __FILE__ ),
            array(),
            filemtime( TIMED_CONTENT_BLOCK_ABSPATH . 'build/style-index.css' )
        );

        // Register the block
        register_block_type( 'wp-timed-content-block/wp-timed-content-block', array(
            'api_version'     => 3,
            'editor_script'   => 'wp-timed-content-block-editor',
            'editor_style'    => 'wp-timed-content-block-editor-style',
            'style'           => 'wp-timed-content-block-style',
            'render_callback' => array( $this, 'render_block' ),
            'attributes'      => array(
                'startDateTime' => array(
                    'type'    => 'string',
                    'default' => '',
                ),
                'endDateTime'   => array(
                    'type'    => 'string',
                    'default' => '',
                ),
                'recurring'     => array(
                    'type'    => 'boolean',
                    'default' => false,
                ),
                'daysOfWeek'    => array(
                    'type'    => 'array',
                    'default' => array(),
                    'items'   => array( 'type' => 'number' ),
                ),
                'timezone'      => array(
                    'type'    => 'string',
                    'default' => wp_timezone_string(),
                ),
            ),
        ) );
    }

    /**
     * Enqueue block editor assets.
     */
    public function enqueue_block_editor_assets() {
        // Enqueue the block editor script
        wp_enqueue_script( 'wp-timed-content-block-editor' );
        
        // Localize the script with data
        wp_localize_script(
            'wp-timed-content-block-editor',
            'timedContentBlock',
            array(
                'timezone'        => wp_timezone_string(),
                'dateFormat'      => get_option( 'date_format' ),
                'timeFormat'      => get_option( 'time_format' ),
                'startOfWeek'     => (int) get_option( 'start_of_week', 0 ),
                'daysOfWeek'      => array(
                    __( 'Sunday' ),
                    __( 'Monday' ),
                    __( 'Tuesday' ),
                    __( 'Wednesday' ),
                    __( 'Thursday' ),
                    __( 'Friday' ),
                    __( 'Saturday' ),
                ),
                'daysOfWeekShort' => array(
                    __( 'Sun' ),
                    __( 'Mon' ),
                    __( 'Tue' ),
                    __( 'Wed' ),
                    __( 'Thu' ),
                    __( 'Fri' ),
                    __( 'Sat' ),
                ),
            )
        );
    }

    /**
     * Enqueue frontend assets.
     */
    public function enqueue_frontend_assets() {
        if ( has_block( 'wp-timed-content-block/wp-timed-content-block' ) ) {
            wp_enqueue_style( 'wp-timed-content-block-style' );
            
            // Enqueue frontend script if needed
            if ( file_exists( TIMED_CONTENT_BLOCK_ABSPATH . 'build/view.js' ) ) {
                wp_enqueue_script(
                    'wp-timed-content-block-view',
                    plugins_url( 'build/view.js', __FILE__ ),
                    array( 'wp-element', 'wp-hooks' ),
                    filemtime( TIMED_CONTENT_BLOCK_ABSPATH . 'build/view.js' ),
                    true
                );
            }
        }
    }

    /**
     * Render block content.
     *
     * @param array  $attributes Block attributes.
     * @param string $content    Block content.
     * @return string Rendered block content.
     */
    public function render_block( $attributes, $content ) {
        // Get current time in the specified timezone
        $timezone = new DateTimeZone( $attributes['timezone'] );
        $now      = new DateTime( 'now', $timezone );
        
        // Parse start and end times
        $start_date = ! empty( $attributes['startDateTime'] ) ? new DateTime( $attributes['startDateTime'], $timezone ) : null;
        $end_date   = ! empty( $attributes['endDateTime'] ) ? new DateTime( $attributes['endDateTime'], $timezone ) : null;
        
        $should_show = false;
        
        // Check if we're within the date range
        if ( $start_date && $end_date ) {
            if ( $attributes['recurring'] ) {
                // Handle recurring events
                $current_time = $now->format( 'H:i' );
                $current_day  = $now->format( 'w' ); // 0 (Sunday) to 6 (Saturday)
                
                $start_time = $start_date->format( 'H:i' );
                $end_time   = $end_date->format( 'H:i' );
                
                // Check if current day is in selected days
                $is_day_selected = in_array( (int) $current_day, $attributes['daysOfWeek'], true );
                
                // Check if current time is within the time range
                $is_time_in_range = ( $current_time >= $start_time && $current_time <= $end_time );
                
                $should_show = $is_day_selected && $is_time_in_range;
            } else {
                // Handle one-time events
                $should_show = ( $now >= $start_date && $now <= $end_date );
            }
        }
        
        // If content shouldn't be shown, return empty string
        if ( ! $should_show ) {
            return '';
        }
        
        // Return the block content with a wrapper for styling
        return sprintf(
            '<div class="wp-block-wp-timed-content-block">%s</div>',
            $content
        );
    }
}

/**
 * Initialize the plugin.
 */
function wp_timed_content_block_init() {
    return Timed_Content_Block::instance();
}

// Start the plugin
add_action( 'plugins_loaded', 'wp_timed_content_block_init' );

// Register activation hook
register_activation_hook( __FILE__, array( 'Timed_Content_Block', 'activate' ) );

// Register deactivation hook
register_deactivation_hook( __FILE__, array( 'Timed_Content_Block', 'deactivate' ) );
