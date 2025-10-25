/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, DateTimePicker, Button, Modal, TimePicker, Toolbar, ToolbarGroup, ToolbarButton, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

// Import styles
import './editor.scss';

// Import the block's metadata
import metadata from './block.json';

const startOfDay = (date) => {
    const referenceDate = new Date(date);
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 0, 0, 0);
}

const endOfDay = (date) => {
    const referenceDate = new Date(date);
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 23, 59, 59);
}

const MyModal = ({ timestamp, closeModal }) => {
    const [currentValue, setCurrentValue] = useState(timestamp);
    return (
        <>
            <Modal title={ __( 'Select Date and Time', 'wp-timed-content-block' ) } onRequestClose={ () => closeModal() }>
                <DateTimePicker
                        currentDate={currentValue}
                        onChange={(date) => setCurrentValue(date)}
                        startOfWeek="1"
                    />
                <Button variant="secondary" onClick={ () => closeModal(currentValue) }>
                    { __( 'Apply', 'wp-timed-content-block' ) }
                </Button>
            </Modal>
        </>
    );
};

/**
 * Block edit component
 */
const Edit = ( { attributes, setAttributes, isSelected } ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTimeStamp, setModalTimeStamp] = useState(null);
    const [attributeName, setAttributeName] = useState(null);
    const openModal = (timestamp, attributeName) => {
        setModalTimeStamp(timestamp);
        setAttributeName(attributeName);
        setIsModalOpen(true)
    };
    const closeModal = (valueToSave) => {
        if (valueToSave) {
            setAttributes({ [attributeName]: valueToSave });
        }
        setIsModalOpen(false)
    };
    
    const { 
        startDateTime,
        endDateTime,
        timezone
    } = attributes;

    // Set default values when the block is first loaded
    useEffect(() => {
        const now = new Date();
        const defaultStart = startOfDay(now);
        const defaultEnd = endOfDay(now.getTime() + 1000 * 60 * 60 * 24 * 7);
        
        const updates = {};
        if (!startDateTime) {
            updates.startDateTime = defaultStart.toISOString();
        }
        if (!endDateTime) {
            updates.endDateTime = defaultEnd.toISOString();
        }
        
        if (!timezone) {
            updates.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        
        if (Object.keys(updates).length > 0) {
            setAttributes(updates);
        }
    }, []); // Empty dependency array means this runs once on mount

    const blockProps = useBlockProps({
        className: 'wp-block-wp-timed-content-block',
    });

    // Allow all block types by setting to null
    const ALLOWED_BLOCKS = null;

    // Use paragraph as default block
    const TEMPLATE = [
        ['core/paragraph', {"placeholder":__("This is just a placeholder...", "wp-timed-content-block")}]
    ];

    return (
        <div {...blockProps}>            
            <BlockControls>
                <ToolbarGroup label="Options">
                    <ToolbarButton onClick={() => openModal(startDateTime, 'startDateTime')}>
                        { __( 'Start Date', 'wp-timed-content-block' ) }
                    </ToolbarButton>
                    <ToolbarButton onClick={() => openModal(endDateTime, 'endDateTime')}>
                        { __( 'End Date', 'wp-timed-content-block' ) }
                    </ToolbarButton>
                </ToolbarGroup>
            </BlockControls>
            
            {
                isModalOpen && (
                    <MyModal timestamp={modalTimeStamp} closeModal={closeModal}/>
                )
            }

            <div className="timed-content-block-editor">
                <div className="timed-content-block-editor__header">
                    <span className="dashicons dashicons-clock"></span>
                    <span>{__(metadata.title, 'wp-timed-content-block')}</span>
                    <div className="timed-content-block-editor__schedule">
                        <span>From: {startDateTime ? new Date(startDateTime).toLocaleString() : __('Not set', 'wp-timed-content-block')}</span>
                        <span>Until: {endDateTime ? new Date(endDateTime).toLocaleString() : __('Not set', 'wp-timed-content-block')}</span>
                    </div>
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
        'data-start-datetime': attributes.startDateTime,
        'data-end-datetime': attributes.endDateTime,
        'data-timezone': attributes.timezone,
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
registerBlockType({
    ...metadata,
    title: __(metadata.title, 'wp-timed-content-block' ),
    description: __(metadata.description, 'wp-timed-content-block' ),
}, {
    edit: Edit,
    save: Save,
});
