const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } =
    require("@opentelemetry/semantic-conventions");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

// Instrumentations
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } =
    require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
    require("@opentelemetry/instrumentation-mongodb");

module.exports = (serviceName) => {
    const exporter = new JaegerExporter({
        serviceName: todo-service,
        endpoint: "http://localhost:16686/", // Default endpoint for Jaeger
    });

    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new MongoDBInstrumentation(),
        ],
        tracerProvider: provider,
    });

    return trace.getTracer(serviceName);
};
