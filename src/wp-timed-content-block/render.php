<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get block attributes with defaults
$start_datetime = $attributes['startDateTime'] ?? '';
$end_datetime = $attributes['endDateTime'] ?? '';
$timezone = $attributes['timezone'] ?? wp_timezone_string();

// Set the timezone
try {
    $timezone_obj = new DateTimeZone($timezone);
} catch (Exception $e) {
    $timezone_obj = new DateTimeZone('UTC');
}

$now = new DateTime('now', $timezone_obj);
$should_render = false;

// If no timing is set, show the content
if (empty($start_datetime) || empty($end_datetime)) {
    $should_render = true;
} else {
    $start_date = new DateTime($start_datetime, $timezone_obj);
    $end_date = new DateTime($end_datetime, $timezone_obj);
    // For one-time events, check if current time is within the date range
    $should_render = ($now >= $start_date && $now <= $end_date);
}

// Don't output anything if the content shouldn't be shown
if (!$should_render) {
    return;
}

// Get wrapper attributes with fallback for older WordPress versions
$wrapper_attributes = '';
if (function_exists('get_block_wrapper_attributes')) {
    $wrapper_attributes = get_block_wrapper_attributes();
} else {
    // Fallback for WordPress < 5.8
    $wrapper_attributes = 'class="wp-block-wp-timed-content-block"';
}

// Output the block content with wrapper
echo sprintf(
    '<div %s><div class="timed-content-block-content">%s</div></div>',
    $wrapper_attributes,
    $content
);
