import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Alert, Image } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import styles from '../../styles/HackEdit.module.css';
import Asset from "../../components/Asset";

function HackEdit() {
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [hackData, setHackData] = useState({
        title: "",
        content: "",
        image: "",
        category: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    const { title, content, image, category } = hackData;
    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        // Fetch hack details and available categories on component mount
        const fetchData = async () => {
            try {
                const [categoriesRes, hackRes] = await Promise.all([
                    axiosReq.get("/categories/"),
                    axiosReq.get(`/hacks/${id}`),
                ]);

                const categoriesData = categoriesRes.data.results;
                const hack = hackRes.data;

                setCategories(categoriesData);

                // Only allow edit if the current user is the owner
                if (hack.is_owner) {
                    const foundCategory = categoriesData.find(
                        (cat) => cat.id === hack.category?.id
                    );

                    setHackData({
                        title: hack.title,
                        content: hack.content,
                        image: hack.image,
                        category: foundCategory?.id || categoriesData[0]?.id || "",
                    });
                } else {
                    history.push("/");
                }
            } catch (err) { } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [history, id]);

    // Handle text input changes
    const handleChange = (event) => {
        setHackData({
            ...hackData,
            [event.target.name]: event.target.value,
        });
    };

    // Handle image selection and preview
    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setHackData({
                ...hackData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    // Submit updated hack data to the API
    const handleSubmit = async (event) => {
        event.preventDefault();
        const patchData = new FormData();

        patchData.append("title", title);
        patchData.append("content", content);
        patchData.append("category", category);

        // Only append image if a new one is selected
        if (imageInput.current.files[0] && imageInput.current.files[0].size > 0) {
            patchData.append("image", imageInput.current.files[0]);
        }

        try {
            await axiosReq.patch(`/hacks/${id}`, patchData);
            history.push(`/hacks/${id}`);
        } catch (error) {
            if (error.response?.status !== 401) {
                setErrors(error.response?.data);
            }
        }
    };

    // Common form fields
    const textFields = (
        <>
            <Form.Group>
                <Form.Label className="text-white">Title:</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
                {errors?.title?.map((err, idx) => (
                    <Alert key={idx} variant="warning">{err}</Alert>
                ))}
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-white">Content:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange}
                />
                {errors?.content?.map((err, idx) => (
                    <Alert key={idx} variant="warning">{err}</Alert>
                ))}
            </Form.Group>

            {categories.length > 0 && category && (
                <Form.Group>
                    <Form.Label className="text-white">Category:</Form.Label>
                    <Form.Control
                        as="select"
                        name="category"
                        value={category}
                        onChange={handleChange}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Control>
                    {errors?.category?.map((err, idx) => (
                        <Alert key={idx} variant="warning">{err}</Alert>
                    ))}
                </Form.Group>
            )}

            <Button onClick={() => history.goBack()} className="mx-1 my-1">
                Cancel
            </Button>
            <Button className="mx-1 my-1" type="submit">
                Save
            </Button>
        </>
    );

    return (
        <>
            {
                isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }} >
                        <Asset spinner />
                    </div >
                ) : !hackData.title ? (
                    <div className="d-flex flex-column justify-content-center align-items-center text-center my-5">
                        <div className="p-4 border rounded bg-dark shadow" style={{ maxWidth: "500px" }}>
                            <h1 className="text-danger mb-3">404 - Hack not found</h1>
                            <p className="text-white mb-4">
                                Sorry, the hack you're looking for doesn't exist or may have been removed.
                            </p>
                            <Button variant="outline-light" onClick={() => history.push("/")}>
                                Go back to Home
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit} className="p-3">
                        <Row>
                            <Col className="py-3 px-2" md={7} lg={8}>
                                <Container className="d-flex flex-column h-100">
                                    {/* Image preview and upload button */}
                                    <Form.Group className="text-center w-100">
                                        <figure className="mb-3">
                                            <Image
                                                src={image}
                                                rounded
                                                fluid
                                                className="shadow-sm"
                                                style={{ maxHeight: "300px", objectFit: "contain" }}
                                            />
                                        </figure>

                                        <div className="mb-3">
                                            <Form.Label
                                                className={`btn ${styles.CustomButton}`}
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

                                    {/* Mobile view text fields */}
                                    <div className="d-md-none w-100">{textFields}</div>
                                </Container>
                            </Col>

                            <Col md={5} lg={4} className="d-none d-md-block px-2 py-3">
                                <Container className="h-100 d-flex flex-column justify-content-center">
                                    {textFields}
                                </Container>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        </>
    );
}

export default HackEdit;
