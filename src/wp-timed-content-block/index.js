/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, DateTimePicker } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

// Import styles
import './editor.scss';

// Import the block's metadata
import metadata from './block.json';

/**
 * Block edit component
 */
const Edit = ( { attributes, setAttributes, isSelected } ) => {
    const { 
        startDateTime = '',
        endDateTime = '',
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } = attributes;

    const blockProps = useBlockProps({
        className: 'wp-block-wp-timed-content-block',
    });

    // Set default timezone if not set
    useEffect(() => {
        if (!timezone) {
            setAttributes({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        }
    }, [timezone]);

    // Allow all block types by setting to null
    const ALLOWED_BLOCKS = null;

    // Use an empty template to avoid adding default blocks
    const TEMPLATE = [['abb/alert-box', {"cId":"15d35458-9","type":"info","message":"Platzhalter für Hinweistext","icon":{"class":"fa-solid fa-circle-info"},"colors":{"color":"#2cacff","bg":"#2cacff1a"},"border":{"width":"2px","color":"#2cacff","radius":"8px"},"shadow":{}}]];

    return (
        <div {...blockProps}>
            {isSelected && (
                <InspectorControls>
                    <PanelBody title={__('Timing Settings', 'wp-timed-content-block')}>                        
                        {
                            <>
                                <h3>{__('Start Date/Time', 'wp-timed-content-block')}</h3>
                                <DateTimePicker
                                    currentDate={startDateTime || new Date().toISOString()}
                                    onChange={(date) => setAttributes({ startDateTime: date })}
                                    is12Hour={true}
                                />
                                
                                <h3 style={{ marginTop: '1.5em' }}>{__('End Date/Time', 'wp-timed-content-block')}</h3>
                                <DateTimePicker
                                    currentDate={endDateTime || new Date().toISOString()}
                                    onChange={(date) => setAttributes({ endDateTime: date })}
                                    is12Hour={true}
                                />
                            </>
                        }
                        
                        <div style={{ marginTop: '1.5em' }}>
                            <SelectControl
                                label={__('Timezone', 'wp-timed-content-block')}
                                value={timezone}
                                options={[
                                    { label: __( 'Site Timezone', 'wp-timed-content-block' ), value: wp.timezoneString || 'UTC' },
                                    { label: __( 'UTC', 'wp-timed-content-block' ), value: 'UTC' },
                                    { label: __( 'Local Time', 'wp-timed-content-block' ), value: Intl.DateTimeFormat().resolvedOptions().timeZone },
                                ]}
                                onChange={(value) => setAttributes({ timezone: value })}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>
            )}
            
            <div className="timed-content-block-editor">
                <div className="timed-content-block-editor__header">
                    <span className="dashicons dashicons-clock"></span>
                    <span>{__('Timed Content', 'wp-timed-content-block')}</span>
                    {!isSelected && (
                        <div className="timed-content-block-editor__schedule">
                            <span>{__('One-time schedule', 'wp-timed-content-block')}</span>
                        </div>
                    )}
                </div>
                <div className="timed-content-block-editor__content">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={false}
                        renderAppender={isSelected ? InnerBlocks.ButtonBlockAppender : false}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Block save component
 */
const Save = ( { attributes } ) => {
    const blockProps = useBlockProps.save({
        className: 'wp-block-wp-timed-content-block',
        'data-start-datetime': attributes.startDateTime || '',
        'data-end-datetime': attributes.endDateTime || '',
        'data-timezone': attributes.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return (
        <div {...blockProps}>
            <div className="timed-content-block-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

/**
 * Register the block
 */
registerBlockType(metadata, {
    edit: Edit,
    save: Save,
});
