"use client";
import { useState } from "react";
import { Upload, Button, Form, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.status === "removed") {
      setFile(info.file.originFileObj || null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success("File uploaded successfully!");
      } else {
        message.error(data.error || "Upload failed.");
      }
      setUploading(false);
    } catch (error) {
      message.error("An error occurred during upload.");
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1>Upload Files to S3 Bucket</h1>

      <Form onFinish={handleSubmit}>
        <Form.Item>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!file || uploading}
            block
          >
            {uploading ? <Spin size="small" /> : "Upload"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadForm;
