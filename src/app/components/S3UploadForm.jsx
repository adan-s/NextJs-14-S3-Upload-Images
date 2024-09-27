"use client";
import { useState } from "react";
import { Upload, Button, Form, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Card from "antd/es/card/Card";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); 

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj;
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error("No file selected.");
      return;
    }

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

      setFile(null);
    } catch (error) {
      message.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "lavender",
        width: 400,
        textAlign: "center",
        padding: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "0 auto",
      }}
    >
      <h1>Upload Files to S3 Bucket</h1>

      <Form onFinish={handleSubmit}>
        <Form.Item>
          <Upload
            beforeUpload={() => false} 
            onChange={handleFileChange}
            accept="image/*"
            maxCount={1} 
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
    </Card>
  );
};

export default UploadForm;
