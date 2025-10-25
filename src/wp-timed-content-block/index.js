/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Block imports
 */
import metadata from './block.json';
import Edit from './edit.js';
import Save from './save.js';

/**
 * Register the block
 */
registerBlockType(
	{
		...metadata,
		title: __( metadata.title, 'wp-timed-content-block' ),
		description: __( metadata.description, 'wp-timed-content-block' ),
	},
	{
		edit: Edit,
		save: Save,
	}
);
