=== Timed Content Block ===
Contributors:      ByteSturm
Tags:              block, content, schedule, timing, gutenberg
Tested up to:      6.7
Stable tag:        1.0.0
Requires at least: 6.7
Requires PHP:      7.4 or higher
License:           GPL-2.0
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Show or hide content based on specific date and time ranges with this Gutenberg block.

== Description ==

The Timed Content Block is a Gutenberg block that allows you to show or hide content based on specific date and time ranges. It's perfect for time-sensitive announcements, limited-time offers, or any content that should only be visible during certain periods.

### Key Features:
- Set start and end dates and time for content visibility
- Simple and intuitive interface in the block editor
- Lightweight and fast
- Compatible with WordPress 6.7 and above

This plugin is inspired by the original "timed-content" plugin by Arno Wetzel (https://github.com/arnowelzel/timed-content) but completely rebuilt for the Gutenberg block editor.

== Installation ==

1. Upload the `wp-timed-content-block` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Add the Timed Content Block to any post or page using the Gutenberg editor
4. Configure your desired time range using the block settings
5. Add your content that should be shown during the specified time period


== Frequently Asked Questions ==

= How does the timezone work? =

The plugin uses your WordPress site's timezone setting (Settings > General). All times are based on this setting.

= Can I use this to schedule content in advance? =

Yes! The block will automatically show or hide content based on the current server time and your specified time range.

= What happens when the time period ends? =

The content will be hidden from public view but will remain in the editor for future use or adjustments.

== Changelog ==

= 1.0.0 =
* Initial release of the Gutenberg block version
* Complete rebuild of the original plugin for modern WordPress
* Added intuitive date/time picker interface

== Support ==

For support, please open an issue on the [GitHub repository](https://github.com/ByteSturm/wp_timed_content_block).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is licensed under the GPL-2.0 license. This means you can use it for free on your personal or commercial website.
