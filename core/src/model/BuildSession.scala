package model

/** In-memory work reused across builds in one watch session.
  * Prepared contexts remain immutable snapshots; this stores only reusable inputs/results.
  */
final class BuildSession:
  private val caches = scala.collection.mutable.Map.empty[AnyRef, Any]
  def cache[K, V](key: BuildSession.Cache[K, V]): scala.collection.mutable.Map[K, V] =
    caches.getOrElseUpdate(key, scala.collection.mutable.Map.empty[K, V])
      .asInstanceOf[scala.collection.mutable.Map[K, V]]

object BuildSession:
  /** An invariant typed identity keeps each cache's key and value types together. */
  final class Cache[K, V]
