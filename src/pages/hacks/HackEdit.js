import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Alert, Image } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

function HackEdit() {

    const [errors, setErrors] = useState({});

    const [hackData, setHackData] = useState({
        title: "",
        content: "",
        image: "",
    });

    const { title, content, image } = hackData;

    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/hacks/${id}`);
                const { title, content, image, is_owner } = data;

                is_owner ? setHackData({ title, content, image }) : history.push("/");
            } catch (err) {
                console.log(err);
            }
        };

        handleMount();
    }, [history, id]);

    const handleChange = (event) => {
        setHackData({
            ...hackData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setHackData({
                ...hackData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const patchData = new FormData();

        patchData.append("title", title);
        patchData.append("content", content);

        if (imageInput.current.files[0] && imageInput.current.files[0].size > 0) {
            patchData.append("image", imageInput.current.files[0]);
        }

        try {
            await axiosReq.patch(`/hacks/${id}`, patchData);
            history.push(`/hacks/${id}`);
        } catch (error) {
            console.log(error);
            if (error.response?.status !== 401) {
                setErrors(error.response?.data);
            }
        }
    };

    const textFields = (
        <div>
            <Form.Group>
                <Form.Label className="text-white">Title:</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>

            {errors?.title?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
            ))}

            <Form.Group>
                <Form.Label className="text-white">Content:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange}
                />
            </Form.Group>

            {errors?.content?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
            ))}

            <Button
                onClick={() => history.goBack()}
                className="mx-1 my-1"
            >
                Cancel
            </Button>
            <Button className="mx-1 my-1" type="submit">
                Save
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <Row>
                <Col className="py-3 px-2" md={7} lg={8}>
                    <Container className="d-flex flex-column h-100">
                        <Form.Group className="text-center w-100">
                            <figure className="mb-3">
                                <Image src={image} rounded fluid className="shadow-sm" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                            </figure>

                            <div className="mb-3">
                                <Form.Label
                                    className="btn btn-outline-primary"
                                    htmlFor="image-upload"
                                >
                                    Change Image
                                </Form.Label>
                                <Form.File
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    ref={imageInput}
                                    className="d-none"
                                />
                            </div>

                            {errors?.image?.map((err, idx) => (
                                <Alert key={idx} variant="warning" className="text-start">
                                    {err}
                                </Alert>
                            ))}
                        </Form.Group>

                        <div className="d-md-none w-100">
                            {textFields}
                        </div>
                    </Container>
                </Col>

                <Col md={5} lg={4} className="d-none d-md-block px-2 py-3">
                    <Container className="h-100 d-flex flex-column justify-content-center">
                        {textFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );

}

export default HackEdit;