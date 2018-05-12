package net.crowd.server.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

public class CustomRestTemplate extends RestTemplate {

    private String callMethod;
    private static final Logger logger = (Logger) LoggerFactory.getLogger(CustomRestTemplate.class);

    public CustomRestTemplate(String method) {
        this.callMethod = method;
    }

    public CustomRestTemplate(String method, int timeout) {
        this.callMethod = method;

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(timeout);
        this.setRequestFactory(factory);
    }

    /**
     * URI Template variables are expanded using the given URI variables, if any.
     * @param String url(the URL)
     * @param HttpMethod method(the HTTP method (GET, POST, etc))
     * @param HttpEntity<?> requestEntity(the entity (headers and/or body) to write to the request, may be null)
     * @param Class<T> responseType(the type of the return value)
     * @param Object uriVariables(the variables to expand in the template)
     * @return ResponseEntity<T>(the response as entity)
     */
    @Override
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity,
                                          Class<T> responseType, Object... uriVariables) throws RestClientException {

        if (logger.isDebugEnabled()) {
            logger.debug(String.format("%s : Request Url [HttpMethod] : %s  [ %s ]", callMethod, url, method.toString()));
            logger.debug(String.format("%s : Request Headers : %s", callMethod, requestEntity.getHeaders().toSingleValueMap()));
            logger.debug(String.format("%s : Request Body : %s", callMethod, requestEntity.getBody()));
        }
        ResponseEntity<T> result = super.exchange(url, method, requestEntity, responseType, uriVariables);
        if (logger.isDebugEnabled()) {
            logger.debug(String.format("%s : Response Status : %s %s", callMethod, result.getStatusCode().value(), result.getStatusCode().name()));
            logger.debug(String.format("%s : Response Headers : %s", callMethod, result.getHeaders().toSingleValueMap()));
            logger.debug(String.format("%s : Response Body : %s", callMethod, result.getBody()));
        }
        return result;
    }

    /**
     * URI Template variables are expanded using the given URI variables, if any.
     * @param String url(the URL)
     * @param HttpMethod method(the HTTP method (GET, POST, etc))
     * @param HttpEntity<?> requestEntity(the entity (headers and/or body) to write to the request, may be null)
     * @param Class<T> responseType(the type of the return value)
     * @param MultiValueMap<String, String> uriVariables(the variables to expand in the template)
     * @return ResponseEntity<T>(the response as entity)
     */
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity,
                                          Class<T> responseType, MultiValueMap<String, String> params) throws RestClientException {

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(url).queryParams(params).build();
        url = uriComponents.toUriString();
        if (logger.isDebugEnabled()) {
            logger.debug(String.format("%s : uriComponents : %s", callMethod, url));
        }
        return this.exchange(url, method, requestEntity, responseType);
    }

}

