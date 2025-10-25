import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Block save component
 * @param {Object} root0            Block object
 * @param {Object} root0.attributes Attributes of the block which should be saved
 */
export const Save = ( { attributes } ) => {
	const blockProps = useBlockProps.save( {
		className: 'wp-block-wp-timed-content-block',
		'data-start-datetime': attributes.startDateTime,
		'data-end-datetime': attributes.endDateTime,
		'data-timezone': attributes.timezone,
	} );

	return (
		<div { ...blockProps }>
			<div className="timed-content-block-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
