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

// Days of the week for the recurring schedule
const DAYS_OF_WEEK = [
    { label: __( 'Sunday', 'wp-timed-content-block' ), value: '0' },
    { label: __( 'Monday', 'wp-timed-content-block' ), value: '1' },
    { label: __( 'Tuesday', 'wp-timed-content-block' ), value: '2' },
    { label: __( 'Wednesday', 'wp-timed-content-block' ), value: '3' },
    { label: __( 'Thursday', 'wp-timed-content-block' ), value: '4' },
    { label: __( 'Friday', 'wp-timed-content-block' ), value: '5' },
    { label: __( 'Saturday', 'wp-timed-content-block' ), value: '6' },
];

/**
 * Block edit component
 */
const Edit = ( { attributes, setAttributes, isSelected } ) => {
    const { 
        startDateTime = '',
        endDateTime = '',
        recurring = false,
        daysOfWeek = [],
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

    const toggleDay = (day) => {
        const newDays = [...daysOfWeek];
        const index = newDays.indexOf(day);
        
        if (index === -1) {
            newDays.push(day);
        } else {
            newDays.splice(index, 1);
        }
        
        setAttributes({ daysOfWeek: newDays });
    };

    return (
        <div {...blockProps}>
            {isSelected && (
                <InspectorControls>
                    <PanelBody title={__('Timing Settings', 'wp-timed-content-block')}>
                        <ToggleControl
                            label={__('Recurring Schedule', 'wp-timed-content-block')}
                            checked={recurring}
                            onChange={(value) => setAttributes({ recurring: value })}
                        />
                        
                        {!recurring ? (
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
                        ) : (
                            <div className="recurring-settings">
                                <h3>{__('Recurring Days', 'wp-timed-content-block')}</h3>
                                {DAYS_OF_WEEK.map((day) => (
                                    <ToggleControl
                                        key={day.value}
                                        label={day.label}
                                        checked={daysOfWeek.includes(parseInt(day.value))}
                                        onChange={() => toggleDay(parseInt(day.value))}
                                    />
                                ))}
                                
                                <h3 style={{ marginTop: '1.5em' }}>{__('Start Time', 'wp-timed-content-block')}</h3>
                                <DateTimePicker
                                    currentDate={startDateTime || new Date().toISOString()}
                                    onChange={(date) => setAttributes({ startDateTime: date })}
                                    is12Hour={true}
                                />
                                
                                <h3 style={{ marginTop: '1.5em' }}>{__('End Time', 'wp-timed-content-block')}</h3>
                                <DateTimePicker
                                    currentDate={endDateTime || new Date().toISOString()}
                                    onChange={(date) => setAttributes({ endDateTime: date })}
                                    is12Hour={true}
                                />
                            </div>
                        )}
                        
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
                            {recurring ? (
                                <span>{__('Recurring schedule', 'wp-timed-content-block')}</span>
                            ) : (
                                <span>{__('One-time schedule', 'wp-timed-content-block')}</span>
                            )}
                        </div>
                    )}
                </div>
                <div className="timed-content-block-content">
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
        'data-recurring': attributes.recurring || false,
        'data-days-of-week': attributes.daysOfWeek ? JSON.stringify(attributes.daysOfWeek) : '[]',
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
