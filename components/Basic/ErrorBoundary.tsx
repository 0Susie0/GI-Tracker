// components/Basic/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../../types/components';
import { colors, fonts, spacing } from '../../utils/theme';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error but don't show AppRegistryBinding errors
    if (!error.message?.includes('AppRegistryBinding') && 
        !error.message?.includes('stopSurface')) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
      
      // Call custom error handler if provided
      this.props.onError?.(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Check if it's an AppRegistryBinding error
      if (this.state.error?.message?.includes('AppRegistryBinding') ||
          this.state.error?.message?.includes('stopSurface')) {
        // Silently retry by resetting the error state
        setTimeout(() => {
          this.setState({ hasError: false, error: undefined });
        }, 100);
        return this.props.children;
      }

      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleRetry} 
          />
        );
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </Text>
          {this.state.error && __DEV__ && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorTitle}>Error Details (Debug Mode):</Text>
              <Text style={styles.errorText}>{this.state.error.message}</Text>
              <Text style={styles.errorStack}>{this.state.error.stack}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: spacing(4),
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  message: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing(4),
    paddingHorizontal: spacing(2),
  },
  errorDetails: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing(3),
    marginBottom: spacing(4),
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    maxHeight: 200,
  },
  errorTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: spacing(2),
  },
  errorText: {
    fontSize: fonts.caption,
    color: colors.text,
    marginBottom: spacing(1),
    fontFamily: 'monospace',
  },
  errorStack: {
    fontSize: 10,
    color: colors.subtext,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: colors.link,
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3),
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;

