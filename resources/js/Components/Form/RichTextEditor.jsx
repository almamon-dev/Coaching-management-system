import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, className }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link', 'image'
    ];

    return (
        <div className={`rich-text-editor ${className}`}>
            <style>{`
                .ql-container.ql-snow {
                    border-color: #EEEEEE !important;
                    border-bottom-left-radius: 2px !important;
                    border-bottom-right-radius: 2px !important;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: 250px;
                }
                .ql-toolbar.ql-snow {
                    border-color: #EEEEEE !important;
                    border-top-left-radius: 2px !important;
                    border-top-right-radius: 2px !important;
                    background-color: #f8fafc;
                }
                .ql-editor {
                    min-height: 250px;
                }
                .ql-editor.ql-blank::before {
                    font-style: normal;
                    color: #94a3b8;
                    font-size: 13px;
                }
                .ql-snow.ql-toolbar button:hover,
                .ql-snow .ql-toolbar button:hover,
                .ql-snow.ql-toolbar button:focus,
                .ql-snow .ql-toolbar button:focus,
                .ql-snow.ql-toolbar button.ql-active,
                .ql-snow .ql-toolbar button.ql-active,
                .ql-snow.ql-toolbar .ql-picker-label:hover,
                .ql-snow .ql-toolbar .ql-picker-label:hover,
                .ql-snow.ql-toolbar .ql-picker-label.ql-active,
                .ql-snow .ql-toolbar .ql-picker-label.ql-active,
                .ql-snow.ql-toolbar .ql-picker-item:hover,
                .ql-snow .ql-toolbar .ql-picker-item:hover,
                .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
                .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
                    color: #ef4a23 !important;
                }
                .ql-snow.ql-toolbar button:hover .ql-stroke,
                .ql-snow .ql-toolbar button:hover .ql-stroke,
                .ql-snow.ql-toolbar button:focus .ql-stroke,
                .ql-snow .ql-toolbar button:focus .ql-stroke,
                .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                .ql-snow .ql-toolbar button.ql-active .ql-stroke,
                .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
                .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
                .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
                .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
                .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
                .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
                .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
                .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
                .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
                .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
                .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
                .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
                .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
                .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
                .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
                .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
                .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
                .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
                .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
                .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
                .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
                .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
                    stroke: #ef4a23 !important;
                }
                .ql-snow.ql-toolbar button:hover .ql-fill,
                .ql-snow .ql-toolbar button:hover .ql-fill,
                .ql-snow.ql-toolbar button:focus .ql-fill,
                .ql-snow .ql-toolbar button:focus .ql-fill,
                .ql-snow.ql-toolbar button.ql-active .ql-fill,
                .ql-snow .ql-toolbar button.ql-active .ql-fill,
                .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
                .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
                .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
                .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
                .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
                .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
                .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
                .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill {
                    fill: #ef4a23 !important;
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
